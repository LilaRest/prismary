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

export function getPrismaryConfig (configFilePath: string) {

}