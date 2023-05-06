
import { GeneratorOptions } from "@prisma/generator-helper";
import { Context } from "../generator";
import { getTemplate, writeArray } from "../utils/other";
import { formatFile } from "../ts-morph-format";

export async function generate (
  options: GeneratorOptions,
  ctx: Context
) {
  // Retrieve the procedures templates file
  const proceduresTemplateFile = await getTemplate("procedures.template.ts");

  const models = options.dmmf.datamodel.models;
  models.forEach((model) => {
    // Generate procedures objects for the current model
    const proceduresFile = ctx.project.createSourceFile(`${ctx.outputDirPath}/${model.name}Procedures.ts`, {}, { overwrite: true });
    writeArray(proceduresFile, proceduresTemplateFile.split("\n"));

    // Format generated file
    formatFile(proceduresFile);
  });
}