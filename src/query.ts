import { MethodClause } from "./clauses";

export class PrismaryQuery {
  model: string;
  method: MethodClause;
  body: object;
  constructor (model: string, method: MethodClause, body: object) {
    this.model = model;
    this.method = method;
    this.body = body;
  }
  async send () {
    return {};
  }
}
