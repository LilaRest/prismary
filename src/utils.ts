import type { SourceFile } from 'ts-morph';
import { readFile } from 'fs/promises';
import { join, resolve } from "path";
import { type DMMF } from "@prisma/generator-helper";
import { type Variant } from "./variants";


export function writeArray (sourceFile: SourceFile, array: string[], newLine = true) {
  sourceFile.addStatements((writer) => {
    array.forEach((line) => writer.write(line).conditionalNewLine(newLine));
  });
}

export function buildVariationName (modelName: string, variant: Variant) {
  return `${modelName}${variant.namePrefix}Schema`;
}

export async function getTemplate (templateName: string) {
  try {
    const filePath = resolve(join(__dirname, "templates"), templateName);
    return await readFile(filePath, 'utf8');
  } catch (err) {
    throw new Error("The template doesn't exist.");
  }
}


function getZodModifiersFromDocString (docString: string) {
  return docString
    .split('\n')
    .filter((line) => line.trimStart().startsWith('@zod'))
    .map((line) => line.trim().slice(4).trim())
    .join("") || "";
}

const zodScalarEquivalents: { [key: string]: string; } = {
  "String": "z.string()",
  "Boolean": "z.boolean()",
  "Int": "z.number().int()",
  "BigInt": "z.bigint()",
  "Float": "z.number()",
  "Decimal": "decimalSchema",
  "DateTime": "z.date()",
  "Json": "jsonSchema",
  "Bytes": "z.instanceof(Buffer)", // NOT TESTED, MAY NOT WORK
  "Unsupported": "z.unknown()"
};

export function getZodSchemaFromField (field: DMMF.Field, variant: Variant) {
  let zodSchema = "z.unknown()";

  // Determine the base type of the field
  if (field.kind === "scalar") zodSchema = zodScalarEquivalents[field.type];
  else if (field.kind === "enum") zodSchema = `z.nativeEnum(${field.type})`;

  // Append extra modifiers if needed
  if (field.isList) zodSchema += ".array()";
  if (field.documentation) {
    zodSchema += getZodModifiersFromDocString(field.documentation);
  }
  if (!field.isRequired && field.type !== "Json") zodSchema += ".nullish()";
  if (variant.isFieldOptional(field)) zodSchema += ".optional()";

  return zodSchema;
};


export type SetToUnion<T> = T extends Set<infer I> ? I : never;


type SelectOrIncludeClause = {
  type: "include" | "select";
  include?: object;
  select?: object;
};
/**
 * - At each level include takes the priority
 */
export function mergeSelectOrIncludeClauses (clause1: SelectOrIncludeClause, clause2: SelectOrIncludeClause) {
  const mergedClauseType = [clause1.type, clause2.type].includes("include") ? "include" : "select";
  const mergedClause: SelectOrIncludeClause = {
    type: mergedClauseType,
    [mergedClauseType]: {}
  };
  _mergeSelectOrIncludeClauses(clause1, clause2, mergedClause[mergedClauseType]);
  const bothClausesAreSame = clause2.type === clause2.type;
  if (mergedClauseType === "include") {
    if (bothClausesAreSame) return;
    mergeSelectOrIncludeClauses;
  }
}

function _mergeSelectOrIncludeClauses (clause1: SelectOrIncludeClause, clause2: SelectOrIncludeClause, receiver?: object) {

}