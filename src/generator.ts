// @ts-ignore Importing package.json for automated synchronization of version numbers 
import { version } from "../package.json";
import { generatorHandler, type EnvValue } from "@prisma/generator-helper";
import { parseEnvValue } from "@prisma/internals";
import { getPrismaryConfig } from "./config";
import { promises as fs } from "fs";
import { Variants } from "./variants";
import { Project, VariableDeclarationKind } from "ts-morph";
import { writeArray, getTemplate, buildVariationName, getZodSchemaFromField } from "./utils";


generatorHandler({
  onManifest: () => ({
    version: version,
    prettyName: "Prismary",
    requiresGenerators: ["prisma-client-js"],
    defaultOutput: "prismary"
  }),
  onGenerate: async (options) => {
    // Retrive & validate configurations
    let configs = getPrismaryConfig(options.generator.config.configFile);

    // Retrieve output directory path and create it recursively if missing
    const outputDirPath = parseEnvValue(options.generator.output as EnvValue);
    await fs.mkdir(outputDirPath, { recursive: true });

    // Initialize ts-morph project
    const project = new Project();

    // Create index.ts file
    const indexFile = project.createSourceFile(`${outputDirPath}/index.ts`, {}, { overwrite: true });

    // Create and generate helpers.ts file
    const helpersFile = project.createSourceFile(`${outputDirPath}/helpers.ts`, {}, { overwrite: true });
    const helpersTemplateFile = await getTemplate("helpers.template.ts");
    writeArray(helpersFile, helpersTemplateFile.split("\n"));

    // Retrieve the procedures templates file
    const proceduresTemplateFile = await getTemplate("procedures.template.ts");

    // Generate tRPC routes for each model and Zod schemas for each model and variation
    const models = options.dmmf.datamodel.models;
    models.forEach((model) => {

      // Generate procedures objects for the current model
      const proceduresFile = project.createSourceFile(`${outputDirPath}/${model.name}Procedures.ts`, {}, { overwrite: true });
      writeArray(proceduresFile, proceduresTemplateFile.split("\n"));

      Object.values(Variants).forEach((variant) => {

        // Build name of the variation
        const variationName = buildVariationName(model.name, variant);

        // Add export line to index file for this variation
        indexFile.addExportDeclaration({ moduleSpecifier: `./${variationName}.ts` });

        // Create the variation file
        const variationFile = project.createSourceFile(`${outputDirPath}/${variationName}.ts`, {}, { overwrite: true });

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
        // if (configs.zodFilePath) {
        //   variationFile.addImportDeclaration({
        //     namespaceImport: "custom",
        //     moduleSpecifier: configs.zodFilePath
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
      });
    });

    // Save ts-morph project
    return project.save();
  },
});