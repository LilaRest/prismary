// @ts-ignore Importing package.json for automated synchronization of version numbers 
import { version } from "../package.json";
import { generatorHandler, type EnvValue } from "@prisma/generator-helper";
import { parseEnvValue } from "@prisma/internals";
import { promises as fs } from "fs";
import { Project, SourceFile } from "ts-morph";
import { generate as generateSpecs } from "./generators/specs";
import { generate as generateSchemas } from "./generators/schemas";
import { generate as generateProcedures } from "./generators/procedures";

import { formatFile } from "./utils/ts-morph-format";
import path from "path";
import { transformFileSync, Options } from '@swc/core';
import fg from "fast-glob";
import { FileConfigSchema, getConfig } from "./config";

export type Context = {
  outputDirPath: string;
  config: FileConfigSchema;
  indexFile: SourceFile;
  project: Project;
};

generatorHandler({
  onManifest: () => ({
    version: version,
    prettyName: "Prismary",
    requiresGenerators: ["prisma-client-js"],
    defaultOutput: path.join(__dirname, ".generated")
  }),
  onGenerate: async (options) => {
    // Initialize context object
    let ctx: Partial<Context> = {};

    // Retrive & validate configurations
    // TODO: Use configs in schema.prisma instead to manipulate generators behaviors

    // Retrieve output directory path and create it recursively if missing
    ctx.outputDirPath = parseEnvValue(options.generator.output as EnvValue);
    await fs.mkdir(ctx.outputDirPath, { recursive: true });

    // Initialize ts-morph project
    ctx.project = new Project();

    // Create index.ts file
    ctx.indexFile = ctx.project.createSourceFile(`${ctx.outputDirPath}/index.ts`, {}, { overwrite: true });

    // Call generators
    await Promise.all([
      generateSpecs(options, ctx as Context),
      generateSchemas(options, ctx as Context),
      generateProcedures(options, ctx as Context),
    ]);

    // Format generated index file
    formatFile(ctx.indexFile);

    // Save ts-morph project
    ctx.project.saveSync();

    // zzz
    try {
      await fs.unlink(path.join(ctx.outputDirPath, "index.d.ts"));
    } catch (e) {}
    try {
      await fs.unlink(path.join(ctx.outputDirPath, "index.js"));
    } catch (e) {}
    try {
      await fs.unlink(path.join(ctx.outputDirPath, "index.js.map"));
    } catch (e) {}

    // Build swc transpiler options
    const swcOptions: Options = {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: false,
          decorators: true,
          dynamicImport: true,
        },
        target: 'es2019',
        loose: false,
      },
      module: {
        type: 'commonjs',
      },
      sourceMaps: true,
    };

    // Retrieve generated file paths
    const generatedFilesPaths = fg.sync([`${ctx.outputDirPath}/**/*`]);

    // Transpile in JS each generated file
    generatedFilesPaths.forEach((filePath) => {
      try {
        const output = transformFileSync(filePath, swcOptions);
        const outputPath = path.join(ctx.outputDirPath!, path.basename(filePath, '.ts') + '.js');

        if (output.map) {
          const mapPath = outputPath + '.map';
          fs.writeFile(mapPath, JSON.stringify(output.map));
        }

        if (output.code) {
          fs.writeFile(outputPath, output.code);
        }
      } catch (err) {
        console.error(`Error compiling ${filePath}: `, err);
      }
    });
  },
});;
