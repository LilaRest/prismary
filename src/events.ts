import { modelsSpecs } from "./.generated";
import { Action } from "./types";

type Context = {
  model: string;
  method: string;
  body: object;
};

type BeforeCallback = (ctx: Context, abort: Function) => void;
type BeforeInTxCallback = (ctx: Context, tx: object, abort: Function) => void;
type AfterInTxCallback = (ctx: Context, tx: object, revert: Function) => void;
type AfterCallback = (ctx: Context, abort: Function) => void;

type EventHandler = {
  select?: object;
  include?: object;
  before?: BeforeCallback;
  beforeInTx?: BeforeInTxCallback;
  afterInTx?: AfterInTxCallback;
  after?: AfterCallback;
};

type Events = {
  [key: keyof typeof modelsSpecs]: Record<Action, Array<EventHandler>>;
};

export const events: Events = {};

type Model = keyof typeof modelsSpecs;

class PrismaryModelEvent {
  model: Model;
  constructor (model: Model) {
    this.model = model;
  }
  on (action: Action, handler: EventHandler) {
    if (!events[this.model]) events[this.model] = {
      create: [],
      read: [],
      update: [],
      delete: [],
      manage: [],
    };
    events[this.model][action].push(handler);
  }
  onCreate (handler: EventHandler) { this.on("create", handler); }
  onRead (handler: EventHandler) { this.on("read", handler); }
  onUpdate (handler: EventHandler) { this.on("update", handler); }
  onDelete (handler: EventHandler) { this.on("delete", handler); }
  onManage (handler: EventHandler) { this.on("manage", handler); }
}

class PrismaryEvent {
  [key: Model]: PrismaryModelEvent;
  constructor () {
    for (const model of Object.keys(modelsSpecs)) {
      this[model] = new PrismaryModelEvent(model);
    }
  }
}
export const prismaryEvents = new PrismaryEvent();
prismaryEvents.user.on("create", {
  before: (ctx, abort) => {
  },
});