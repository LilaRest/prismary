import { z } from 'zod';

const configBoolean = z
  .enum(['true', 'false'])
  .transform((arg) => JSON.parse(arg));

export const configSchema = z.object({
  prismaClientFilePath: z.string(),
  prismaClientName: z.string().default("prisma"),
  trpcInstanceFilePath: z.string().default("~/src/server/trpc/trpc"),
  trpcInstanceName: z.string().default("t"),
  withZod: configBoolean.default("true"),
  zodFilePath: z.string().optional(),
  withCasl: configBoolean.default("true"),
  caslFilePath: z.string().optional(),
  caslInstanceName: z.string().default("ability")
});

export type Config = z.infer<typeof configSchema>;