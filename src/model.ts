import { methodClauses, MethodClause } from "./clauses";
import { PrismaryQuery } from "./query";
import { events, EventHandler } from "./events";
import { Action } from "./types";

export class PrismaryModel {
  private _model: string;
  [key: MethodClause]: Function | string;

  constructor (model: string) {
    this._model = model;
    for (const method of methodClauses) {
      this[method] = (body: object) => {
        const query = new PrismaryQuery(model, method, body);
        return query.send();
      };
    }
  }
  on (action: Action, handler: EventHandler) {
    if (!events[this._model]) events[this._model] = {
      create: [],
      read: [],
      update: [],
      delete: [],
      manage: [],
    };
    events[this._model][action].push(handler);
  }
  onCreate (handler: EventHandler) { this.on("create", handler); }
  onRead (handler: EventHandler) { this.on("read", handler); }
  onUpdate (handler: EventHandler) { this.on("update", handler); }
  onDelete (handler: EventHandler) { this.on("delete", handler); }
  onManage (handler: EventHandler) { this.on("manage", handler); }
}