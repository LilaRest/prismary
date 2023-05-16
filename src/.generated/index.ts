import { ZodObject } from "zod";
import { MethodClause, ParentClause } from "../clauses";
import { Prisma } from "@prisma/client";

const _generated = require("../../dist/.generated");

type ModelsSpecs = {
  [key: string]: {
    fields: Set<string>,
    relations: Record<string, string>;
    schema: ZodObject<any>;
    argsTypes: Record<MethodClause, Record<ParentClause, object>>;
  };
};

interface Generated {
  modelsSpecs: ModelsSpecs;
}

export const { modelsSpecs } = _generated as Generated;
