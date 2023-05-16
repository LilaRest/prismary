import { ZodObject, ZodSchema } from "zod";

const _generated = require("../../dist/.generated");

type ModelsSpecs = {
  [key: string]: {
    fields: Set<string>,
    relations: Record<string, string>;
    schema: ZodObject<any>;
  };
};

interface Generated {
  modelsSpecs: ModelsSpecs;
}

export const { modelsSpecs } = _generated as Generated;
