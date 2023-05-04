import { z } from "zod";

export const UserCreateSchema = z.object({
        email: z.string(),
        name: z.string().nullish(),
        bases: z.unknown().array(),
    });
