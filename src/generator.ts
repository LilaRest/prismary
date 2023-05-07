// @ts-ignore Importing package.json for automated synchronization of version numbers 
import { version } from "../package.json";
import { generatorHandler, type EnvValue } from "@prisma/generator-helper";
import { parseEnvValue } from "@prisma/internals";
import { promises as fs } from "fs";
import { Project, SourceFile } from "ts-morph";
import { generate as generateSpecs } from "./generators/specs";
import { generate as generateSchemas } from "./generators/schemas";
import { generate as generateProcedures } from "./generators/procedures";
import { formatFile } from "./ts-morph-format";
import path from "path";
import { findProjectRoot } from "./utils/other";

export type Context = {
  outputDirPath: string;
  // config: FileConfigSchema;
  indexFile: SourceFile;
  project: Project;
};

generatorHandler({
  onManifest: () => ({
    version: version,
    prettyName: "Prismary",
    requiresGenerators: ["prisma-client-js"],
    defaultOutput: path.join(findProjectRoot(), 'node_modules', '@prismary', 'client')
  }),
  onGenerate: async (options) => {
    // Initialize context object
    let ctx: Partial<Context> = {};

    // Retrive & validate configurations
    // context.config = await getPrismaryConfig(options.generator.config.configFilePath);
    // if (!context.config) throw new Error("Prismary cannot retrieve your configuration object.");

    // Retrieve output directory path and create it recursively if missing
    ctx.outputDirPath = parseEnvValue(options.generator.output as EnvValue);
    await fs.mkdir(ctx.outputDirPath, { recursive: true });

    // Initialize ts-morph project
    ctx.project = new Project();

    // Create index.ts file
    ctx.indexFile = ctx.project.createSourceFile(`${ctx.outputDirPath}/index.ts`, {}, { overwrite: true });

    // Call generators
    await generateSpecs(options, ctx as Context);
    await generateSchemas(options, ctx as Context);
    await generateProcedures(options, ctx as Context);

    // Format generated index file
    formatFile(ctx.indexFile);

    // Save ts-morph project
    return ctx.project.save();
  },
});
