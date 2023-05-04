import { z } from "zod";

export const UserSchema = z.object({
        id: z.number().int(),
        email: z.string(),
        name: z.string().nullish(),
        bases: z.unknown().array(),
    });
