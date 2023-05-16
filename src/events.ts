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

export type EventHandler = {
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