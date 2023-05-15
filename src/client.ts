import { modelsSpecs } from "./.generated";
import { PrismaryModel } from "./model";

export class PrismaryClient {
  [key: keyof typeof modelsSpecs]: PrismaryModel;
  constructor () {
    for (const model of Object.keys(modelsSpecs)) {
      this[model] = new PrismaryModel(model);
    }
  }
}