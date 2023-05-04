import { z } from "zod";

export const UserUpdateSchema = z.object({
        email: z.string().optional(),
        name: z.string().nullish().optional(),
        bases: z.unknown().array().optional(),
    });
