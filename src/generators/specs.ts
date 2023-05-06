
import { GeneratorOptions } from "@prisma/generator-helper";
import { Context } from "../generator";
import { formatFile } from "../ts-morph-format";
import { VariableDeclarationKind } from "ts-morph";


export async function generate (
  options: GeneratorOptions,
  ctx: Context
) {
  // Create the models-specs.ts file
  const modelsSpecsFile = ctx.project.createSourceFile(`${ctx.outputDirPath}/models-specs.ts`, {}, { overwrite: true });

  const models = options.dmmf.datamodel.models;
  let modelsSpecs = "{";
  models.forEach((model) => {
    const modelName = model.name.toLowerCase();

    const fields: string[] = [];
    const relations = {} as { [key: string]: string; };
    for (const field of model.fields) {
      fields.push(field.name);
      if (field.relationName) relations[field.name] = field.type.toLowerCase();
    }

    modelsSpecs += `${modelName}: {
      fields: new Set(${JSON.stringify(fields)}),
      relations: ${JSON.stringify(relations)}
    },`;
  });
  modelsSpecs += "}";

  modelsSpecsFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: "modelsSpecs",
        type: "{ [key: string]: any }",
        initializer: modelsSpecs
      }
    ]
  });

  // Format generated file
  formatFile(modelsSpecsFile);

  // Export model-specs.ts file from index
  ctx.indexFile.addExportDeclaration({ moduleSpecifier: `./models-specs.ts` });
};