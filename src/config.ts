import { z } from 'zod';
import { PrismaClient } from "@prisma/client";
import { Ability } from '@casl/ability';


export const prismaConfigSchema = z.object({
  configFilePath: z.string().default("auto"),
});

export type PrismaConfigSchema = z.infer<typeof prismaConfigSchema>;

const fileConfigSchema = z.object({
  prismaClientInstance: z.instanceof(PrismaClient),
  trcpBackendInstance: z.object({
    procedure: z.any(),
    router: z.any(),
    middleware: z.any(),
  }),
  caslAbilityInstance: z.instanceof(Ability).optional(),
  zodCustomObject: z.object({}).optional()
});

type FileConfigSchema = z.infer<typeof fileConfigSchema>;

export function definePrismaryConfig (configs: FileConfigSchema) {
  return fileConfigSchema.parse(configs);
};

const commonConfigPaths = [
  // "~/prisma/prismary.config.ts",
  // "~/src/prisma/prismary.config.ts",
  "/home/lil/fi/POWs/Drops/app/src/prisma/prismary.config.ts"
];

let config: FileConfigSchema | undefined;
export async function getPrismaryConfig (configFilePath: string): Promise<FileConfigSchema | undefined> {
  if (config) return config;
  try {
    config = await import(configFilePath);
  } catch (e) {
    console.log(e);
    for (const commonConfigPath of commonConfigPaths) {
      try {
        config = await import(commonConfigPath);
      } catch (e) { console.log(e); }
    }
  }
  return config;
}