import { modelsSpecs } from "./.generated";
import { MethodClause, methodClauses } from "./clauses";
import { getConfig } from "./config";
import { PrismaClient, Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { events } from "./events";
import { Action, Model } from "./types";
import { mergeSelectOrIncludeClauses } from "./utils/merge-select-or-include-clauses";
import { PrismaQuery } from "@casl/prisma";


// Retrieve config and required instances
const config = getConfig();
if (!config) throw "Prismary: Config object not found.";
const prisma = config.prismaClientInstance as PrismaClient & { [key: string]: any; };
if (!prisma) throw "Prismary: Prisma Client instance not found";

export class PrismaryQuery {
  model: string;
  method: MethodClause;
  body: typeof modelsSpecs[Model]["argsTypes"][MethodClause];
  preparation: ReturnType<typeof this.prepare>;
  validation: ReturnType<typeof this.validate>;

  constructor (model: string, method: MethodClause, body: typeof modelsSpecs[Model]["argsTypes"][MethodClause]) {
    this.model = model;
    this.method = method;
    this.body = body;
    this.validation = this.validate();
    this.preparation = this.prepare();
  }

  async send () {
    // Await validation process and return error if any
    const vResult = await this.validation;
    if (vResult !== true) {
      if (vResult instanceof ZodError) throw vResult;
      else throw new Error("Prismary: Unhandled error.");
    }

    // Await preparation process
    const { readQueryBody, eventsMap, permissionsMap } = await this.preparation;

    // Call every before() event
    const ctx = {
      model: this.model,
      method: this.method,
      body: this.body,
    };
    for (const [model, actions] of Object.entries(eventsMap)) {
      for (const action of actions) {
        for (const handler of events[model][action]) {
          if (handler.before) {
            handler.before(
              ctx,
              () => { throw "Aborted by before() event."; }
            );
          }
        }
      }
    }

    // Starts prisma transaction
    prisma.$transaction(async (tx) => {
      // Retrieve data from database if readBody is non-empty
      // (which means that some are required by else events, authorization or query)
      let readData: Array<any> = [];
      if (Object.keys(readQueryBody).length) {
        readData = await tx[this.model].findMany(readQueryBody);
        if (!readData.length) return readData;  // Abort if no data found
      }

      // Call every beforeInTx() event
      for (const [model, actions] of Object.entries(eventsMap)) {
        for (const action of actions) {
          for (const handler of events[model][action]) {
            if (handler.beforeInTx) {
              handler.beforeInTx(
                ctx,
                tx,
                () => { throw "Aborted by beforeInTx() event."; }
              );
            }
          }
        }
      }

      // Await authorization process
      // const aResult = await this.authorize(readData, permissionsMap);
      // if (aResult !== true) throw aResult;

      // Call every afterInTx() event
      for (const [model, actions] of Object.entries(eventsMap)) {
        for (const action of actions) {
          for (const handler of events[model][action]) {
            if (handler.afterInTx) {
              handler.afterInTx(
                ctx,
                tx,
                () => { throw "Aborted by afterInTx() event."; }
              );
            }
          }
        }
      }
    });

    // Call every after() event
    for (const [model, actions] of Object.entries(eventsMap)) {
      for (const action of actions) {
        for (const handler of events[model][action]) {
          if (handler.after) {
            handler.after(
              ctx,
              () => { throw "Aborted by after() event."; }
            );
          }
        }
      }
    }

    // Filter and return query requested data
    // TODO: Filter query requested data
    return {};
  }

  async validate (): Promise<true | ZodError> {
    const validations = this._validate(this.body, this.model);
    try {
      await Promise.all(validations);
      return true;
    } catch (error) {
      return error as ZodError;
    }
  }

  _validate (body: object, model: string): Array<Promise<any | ZodError>> {
    const validations: Array<Promise<any | ZodError>> = [];
    for (const [key, value] of Object.entries(body)) {
      if (value !== null && typeof value === "object") { // "null" is an object in JS
        if (Array.isArray(value)) {
          for (const item of value) {
            validations.push(...this._validate(item, model));
          }
        }
        else {
          const relationModel = modelsSpecs[model].relations[key];
          if (relationModel) validations.push(...this._validate(value, relationModel));
          else validations.push(...this._validate(value, model));
        }
      }
      else if (modelsSpecs[model].fields.has(key)) {
        validations.push(modelsSpecs[model].schema.shape.fields[key].safeParseAsync(value));
      }
    }
    return validations;
  }

  async prepare (): Promise<{
    readQueryBody: object;
    eventsMap: Record<Model, Array<Action>>;
    permissionsMap: Record<Model, Array<Action>>;
  }> {

    // Retrieve all the select or include clauses
    const selectOrIncludeClauses = [];
    selectOrIncludeClauses.push({
      [this.body.include ? "include" : "select"]: this.body.include || this.body.select || {}
    });
    if (this.body.include) selectOrIncludeClauses.push({ include: this.body.include });
    else if (this.body.select) selectOrIncludeClauses.push({ include: this.body.select });
    selectOrIncludeClauses.push(casl.selectedFiels);
    selectOrIncludeClauses.push(events.selectedFields);

    const permissionsMap = {};
    // const bodies = [this.body, ...events[this.model].after.bodies, casl.queryBodies];

    // Merge all the select or include clauses to build the readQueryBody one
    let readQueryBodySelectOrIncludeClause = selectOrIncludeClauses.pop();
    for (const selectOrIncludeClause of selectOrIncludeClauses) {
      readQueryBodySelectOrIncludeClause = mergeSelectOrIncludeClauses(this.model, readQueryBodySelectOrIncludeClause, selectOrIncludeClause);
    }

    await this._prepare(this.body, readQueryBody, permissionsMap);
    return {
      readQueryBody: {
        //@ts-ignore
        ...readQueryBodySelectOrIncludeClause,
      },
      eventsMap: {},
      permissionsMap: permissionsMap
    };
  }

  _prepare (body: object, readQueryBody: object, permissionsMap: object) {
    for (const [key, value] of Object.entries(body)) {

    }
  }

  async authorize (readData: Array<any>) {
  }
}