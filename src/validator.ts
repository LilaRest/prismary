import { PrismaClient } from "@prisma/client";
import {
  ignoredClauses, type IgnoredClause,
  notSupportedClauses, type NotSupportedClause, notSupportedClausesReasons,
  type MethodClause,
  supportsWhereClauses,
  SupportWhereClause,
} from "./clauses";
import { NotSupportedError } from "./errors";
import { accessibleBy } from "@casl/prisma";
import { modelsSpecs } from "./.generated";
import { Stack } from "./utils/stack";

// Retrieve config and required instances
// const ability = config.caslAbilityInstance;



type QueryBody = { [key: string]: any; };

type ReadQueryBody = Partial<{
  where: object;
  orderBy: object;
  skip: number;
  cursor: object;
  take: number;
  select: object;
  include: object;
  distinct: Array<string>;
}>;



export class ValidatedQuery {
  model: string;
  method: MethodClause;
  body: QueryBody;
  stacks: Record<string, Stack<any>>;
  readBody: ReadQueryBody;
  readData: Array<any>;
  requirements: object;
  readRequired: boolean;

  constructor (model: string, method: MethodClause, body: object) {
    this.model = model;
    this.method = method;
    this.body = { [method]: body };
    this.stacks = {
      model: new Stack(),
      actions: new Stack(),
    };
    this.readBody = {};
    this.readData = [];
    this.requirements = {};
    this.readRequired = false;
  };

  /**
   * Prepare, validate, send and then build response of the query represented
   * by this object.
   * @returns refer to Prisma Docs
   */
  async send () {
    try {
      await this.prepare();
      let response: any;
      prisma.$transaction(async (tx) => {
        if (this.readRequired) {
          await this.queryData(tx);
          if (!this.readData.length) return;
        }
        await this.validate();
        //@ts-ignore
        response = await tx[this.model][this.method](this.body[this.method]);
      });

      return await this.formatReturn(response);
    }
    catch (e) {
      throw e;
    }
  }

  /**
   * Here:
   * - Build readBody
   *   - From user requested data
   *   - Data required by CASL rules
   * - Add accessibleBy(ability).Model to each place that support `where` statement in body and readBody
   * - Build required permissions list for validate() step
   */

  async prepare () {
    // Push query's model in the model stack
    this.stacks.model.push(this.model);

    // Parse and prepare: the query's body, the read query's body, the requirements object
    this._prepare(
      this.body,
      this.readBody,
      this.requirements,
    );

    /*
      This body will be appended
    */
  }


  _prepare (body: any, readBody: any, requirements: any) {

    // Retrieve model specifications
    const modelSpec = modelsSpecs[this.stacks.model.get()];

    // Iterate over given body keys
    for (const key in body) {

      // If key is neither an ingored nor an unsupported clause
      if (!ignoredClauses.has(key as IgnoredClause)) {
        if (notSupportedClauses.has(key as NotSupportedClause)) throw NotSupportedError(key, notSupportedClausesReasons[key]);

        // Retrieve body
        const keyBody = body[key];

        if (modelSpec.scalars.has(key)) {
          requirements[key].actions.push(this.stacks.actions.get());
          readBody[key] = true;

          if (modelSpec.relations.has(key)) {
            readBody[key] = { select: {} };
            this.stacks.model.push(modelSpec.relationsModels[key]);
            this._prepare(keyBody, readBody[key].select, requirements[key]);
            this.stacks.model.pop();
          }
        }

        else {


          // If key supports `where` clause, append CASL where statement to its body
          if (supportsWhereClauses.has(key as SupportWhereClause)) {
            // @ts-ignore
            const caslWhere = accessibleBy(ability)[this.stacks.model.get()];
            if (!("where" in keyBody)) keyBody.where = caslWhere;
            else if (!("AND" in keyBody.where)) {
              const newWhere = { AND: [keyBody.where, caslWhere] };
              keyBody.where = newWhere;
            }
            else keyBody.where.AND.push(caslWhere);
          }



          // else if (parentClauses.has(key as ParentClause)) {
          //   const clauseActions = parentClausesActions[key as ParentClause];
          //   this.stacks.actions.push(clauseActions);
          //   this._prepare(keyValue, readBody, requirements);
          //   this.stacks.actions.pop();
          // }

          // else if (extendClauses.has(key as ExtendClause)) {
          //   this._prepare(keyValue, readBody, requirements);
          // }
        }
      }
    }
  }


  async validate () {

    // for (const row of this.readData) {
    //   this.validateRow(this.model, row);
    //   if (modelsSpecs[model].relations.has())
    // }

    // for (const validate) {

    // }

  }

  /**
   * Here:
   * - Use the previously retrieved data to test against the previously built permissions list, only field-level restrictions must be tested as accessibleBy has alreeady filtered accessible rows
   */

  /**
   * About the where validation problem and silent failure: 
   * - let's add accessibleBy() to each where statement
   * - On Prisma client methods, only update and delete are returning an error on not found, other methods are returning empty data or count of touched rows. Should we fit on this design to make result predictable and user feel home ?
   *    - I want to say yes, but errors should be TRPCError isn't it ? TODO: verify if it's a convention to return only TRPCError or
   */

  async validateRow (model: string, row: object) {
    // this.requirements[model]:
  }

  async formatReturn (response: any) {
    /**
     * Here:
     * - Filter only fields requested by initial select and include statements from data
     * - Update values touched by update statement
     */
  }

  // canForEach (permissions: Action[], subject: string, field?: string) {
  //   for (const permission of permissions) {
  //     if (!ability.can(permission, subject, field)) return false;
  //   }
  //   return true;
  // }
}