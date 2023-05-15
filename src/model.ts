import { methodClauses, MethodClause } from "./clauses";
import { PrismaryQuery } from "./query";

export class PrismaryModel {
  [key: MethodClause]: any;
  constructor (model: string) {
    for (const method of methodClauses) {
      this[method] = (body: object) => {
        const query = new PrismaryQuery(model, method, body);
        return query.send();
      };
    }
  }
}