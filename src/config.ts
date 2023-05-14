import { z } from 'zod';
import { PrismaClient } from "@prisma/client";
import { Ability } from '@casl/ability';
import { initTRPC } from "@trpc/server";


export const prismaConfigSchema = z.object({
  configFile: z.string().default("auto"),
});

export type PrismaConfigSchema = z.infer<typeof prismaConfigSchema>;

const fileConfigSchema = z.object({
  prismaClientInstance: z.instanceof(PrismaClient),
  trcpBackendInstance: z.record(z.any()),
  caslAbilityInstance: z.instanceof(Ability).optional(),
  zodCustomObject: z.object({}).optional()
});

export type FileConfigSchema = z.infer<typeof fileConfigSchema> & {
  trcpBackendInstance: ReturnType<typeof initTRPC.create>;
};

let _config: FileConfigSchema | undefined;

export function defineConfig (config: FileConfigSchema) {
  _config = fileConfigSchema.parse(config) as FileConfigSchema;
};

export function getConfig (): FileConfigSchema | undefined {
  return _config;
}