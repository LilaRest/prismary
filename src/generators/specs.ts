
import { GeneratorOptions } from "@prisma/generator-helper";
import { Context } from "../generator";
import { formatFile } from "../utils/ts-morph-format";
import { VariableDeclarationKind } from "ts-morph";


export async function generate (
  options: GeneratorOptions,
  ctx: Context
) {
  // Create the models-specs.ts file
  const modelsSpecsFile = ctx.project.createSourceFile(`${ctx.outputDirPath}/models-specs.ts`, {}, { overwrite: true });


  modelsSpecsFile.addImportDeclaration({
    moduleSpecifier: `@prisma/client`,
    namedImports: ["Prisma"],
  });

  const models = options.dmmf.datamodel.models;
  let modelsSpecs = "{";
  models.forEach(async (model) => {
    const schemaName = model.name + "Schema";
    const modelName = model.name.toLowerCase();

    modelsSpecsFile.addImportDeclaration({
      moduleSpecifier: `./${schemaName}`,
      namedImports: [schemaName],
    });

    const fields: string[] = [];
    const relations = {} as { [key: string]: string; };
    for (const field of model.fields) {
      fields.push(field.name);
      if (field.relationName) relations[field.name] = field.type.toLowerCase();
    }

    modelsSpecs += `${modelName}: {
      fields: new Set(${JSON.stringify(fields)}),
      relations: ${JSON.stringify(relations)},
      schema: ${schemaName},
      argsTypes: {
        findUnique: {} as Prisma.${model.name}FindUniqueArgs,
        findUniqueOrThrow: {} as Prisma.${model.name}FindUniqueOrThrowArgs,
        findFirst: {} as Prisma.${model.name}FindFirstArgs,
        findFirstOrThrow: {} as Prisma.${model.name}FindFirstOrThrowArgs,
        findMany: {} as Prisma.${model.name}FindManyArgs,
        create: {} as Prisma.${model.name}CreateArgs,
        update: {} as Prisma.${model.name}UpdateArgs,
        upsert: {} as Prisma.${model.name}UpsertArgs,
        delete: {} as Prisma.${model.name}DeleteArgs,
        createMany: {} as Prisma.${model.name}CreateManyArgs,
        updateMany: {} as Prisma.${model.name}UpdateManyArgs,
        deleteMany: {} as Prisma.${model.name}DeleteManyArgs,
        count: {} as Prisma.${model.name}CountArgs,
        aggregate: {} as Prisma.${model.name}AggregateArgs,
        groupBy: {} as Prisma.${model.name}GroupByArgs,
      }
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
  ctx.indexFile.addExportDeclaration({ moduleSpecifier: `./models-specs` });
};