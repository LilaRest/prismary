import { z } from "zod";

export const BaseSchema = z.object({
        user: z.unknown(),
        userId: z.number().int(),
    });
