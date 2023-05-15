import { PrismaClient } from "@prisma/client";
import { modelsSpecs } from "./.generated";
import { methodClauses, MethodClause } from "./clauses";
import { getConfig } from "./config";
import { ValidatedQuery } from "./validator";

const config = getConfig();
const prisma = config?.prismaClientInstance as PrismaClient & {
  [key: string]: any;
};
if (!prisma) throw "Prisma Client instance not found";

class PrismaryModel {
  [key: MethodClause]: any;
  constructor (model: string) {
    for (const methodName of methodClauses) {
      this[methodName] = (body: object) => {
        new ValidatedQuery(model, methodName, body).send();
      };
    }
  }
}

export class PrismaryClient {
  [key: keyof typeof modelsSpecs]: PrismaryModel;
  constructor () {
    for (const model of Object.keys(modelsSpecs)) {
      this[model] = new PrismaryModel(model);
    }
  }
}