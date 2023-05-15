import { modelsSpecs } from "./.generated";
import { MethodClause } from "./clauses";
import { getConfig } from "./config";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";
import { events } from "./events";


// Retrieve config and required instances
const config = getConfig();
if (!config) throw "Prismary: Config object not found.";
const prisma = config.prismaClientInstance as PrismaClient & { [key: string]: any; };
if (!prisma) throw "Prismary: Prisma Client instance not found";

export class PrismaryQuery {
  model: string;
  method: MethodClause;
  body: object;
  preparation: ReturnType<typeof this.prepare>;
  validation: ReturnType<typeof this.validate>;

  constructor (model: string, method: MethodClause, body: object) {
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
    const { readQueryBody, permissionsMap } = await this.preparation;

    // Call every before event
    events[this.model].before.forEach((event: Function) => event(this.model, this.method, this.body));

    // Starts prisma transaction
    prisma.$transaction(async (tx) => {
      // Retrieve data from database if readBody is non-empty
      // (which means that some are required by else events, authorization or query)
      let readData: Array<any> = [];
      if (Object.keys(readBody).length) {
        readData = await tx[this.model].findMany(readBody);
        if (!readData.length) return readData;  // Abort if no data found
      }

      // Await authorization process
      const aResult = await this.authorize(readData, permissionsMap);
      if (aResult !== true) throw aResult;
    });
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
        validations.push(modelsSpecs[model].schema.fields[key].safeParseAsync(value));
      }
    }
    return validations;
  }

  async prepare (): Promise<{ readQueryBody: object; permissionsMap: object; }> {
    const readQueryBody = {};
    const permissionsMap = {};
    const bodies = [this.body, ...events[this.model].after.bodies, casl.queryBodies];
    await this._prepare(this.body, readQueryBody, permissionsMap);
    return { readQueryBody, permissionsMap };
  }

  _prepare (body: object, readQueryBody: object, permissionsMap: object) {
    for (const [key, value] of Object.entries(body)) {

    }
  }

  async authorize (readData: Array<any>) {
  }
}
