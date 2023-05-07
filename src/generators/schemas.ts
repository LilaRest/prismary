
import { GeneratorOptions } from "@prisma/generator-helper";
import { Context } from "../generator";
import { buildVariationName, getTemplate, getZodSchemaFromField, writeArray } from "../utils/other";
import { Variants } from "../variants";
import { VariableDeclarationKind } from "ts-morph";
import { formatFile } from "../utils/ts-morph-format";

export async function generate (
  options: GeneratorOptions,
  ctx: Context
) {

  // Create and generate helpers.ts file
  const helpersFile = ctx.project.createSourceFile(`${ctx.outputDirPath}/helpers.ts`, {}, { overwrite: true });
  const helpersTemplateFile = await getTemplate("helpers.template.ts");
  writeArray(helpersFile, helpersTemplateFile.split("\n"));

  const models = options.dmmf.datamodel.models;
  models.forEach((model) => {
    Object.values(Variants).forEach((variant) => {

      // Build name of the variation
      const variationName = buildVariationName(model.name, variant);

      // Add export line to index file for this variation
      ctx.indexFile.addExportDeclaration({ moduleSpecifier: `./${variationName}` });

      // Create the variation file
      const variationFile = ctx.project.createSourceFile(`${ctx.outputDirPath}/${variationName}.ts`, {}, { overwrite: true });

      // Import zod into variation file
      variationFile.addImportDeclaration({ moduleSpecifier: "zod", namedImports: ["z"] });

      // Import decimalSchema if some field of the model is of Decimal type
      if (model.fields.some((f) => f.type === "Decimal"))
        variationFile.addImportDeclaration({ moduleSpecifier: "./helpers", namedImports: ["decimalSchema"] });

      // Import jsonSchema if some field of the model is of Json type
      if (model.fields.some((f) => f.type === "Json"))
        variationFile.addImportDeclaration({ moduleSpecifier: "./helpers", namedImports: ["jsonSchema"] });

      // Import required enums from Prisma
      const enumFields = model.fields.filter((f) => f.kind === "enum");
      if (enumFields.length > 0) {
        variationFile.addImportDeclaration({
          moduleSpecifier: "@prisma/client",
          namedImports: enumFields.map((f) => f.type),
        });
      }

      // Import custom schema if a "zodFilePath" is given
      // if (ctx.config.zodFilePath) {
      //   variationFile.addImportDeclaration({
      //     namespaceImport: "custom",
      //     moduleSpecifier: ctx.config.zodFilePath
      //   });
      // }

      // Write zod rules infered from fields types and user comments
      variationFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        leadingTrivia: (writer) => writer.blankLineIfLastNot(),
        declarations: [
          {
            name: variationName,
            initializer (writer) {
              writer
                .write("z.object(")
                .inlineBlock(() => {
                  model.fields
                    .filter((field) => !variant.isFieldIgnored(field))
                    .forEach((field) => {
                      writer
                        .write(`${field.name}: ${getZodSchemaFromField(field, variant)},`)
                        .newLine();
                    });
                })
                .write(")");
            },
          },
        ],
      });

      // Format generated file
      formatFile(variationFile);
    });
  });
}