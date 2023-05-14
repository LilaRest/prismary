import { z } from "zod";
import { Prisma } from "@prisma/client";


// Types and Zod schemas helpers

// - for JSON fields
export type Literal = boolean | number | string;
export type Json = Literal | { [key: string]: Json; } | Json[];
export const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
export const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]));

// - for Decimal fields
export const decimalSchema = z
  // Accept native Prisma.Decimal objects, string or number
  .instanceof(Prisma.Decimal)
  .or(z.string())
  .or(z.number())
  // Ensure the value can be converted to Prisma.Decimal instance
  .refine((value) => {
    try {
      return new Prisma.Decimal(value);
    } catch (error) {
      return false;
    }
  })
  // Finally, ensure the value is a Prisma.Decimal instance
  .transform((value) => new Prisma.Decimal(value));
