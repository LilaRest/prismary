import { modelsSpecs } from "./.generated";
import { PrismaryModel } from "./model";

export class PrismaryClient {
  [key: keyof typeof modelsSpecs]: PrismaryModel;

  constructor () {
    Object.keys(modelsSpecs).forEach(model => {
      this[model] = new PrismaryModel(model);
    });
  }
}

// Some usage examples
const client = new PrismaryClient();
client.user.on("create", {
  before: (ctx, abort) => {
  },
});

client.user.onDelete({
  afterInTx: (ctx, abort) => {
  }
});