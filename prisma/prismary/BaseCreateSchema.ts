import { z } from "zod";

export const BaseCreateSchema = z.object({
        user: z.unknown(),
        userId: z.number().int(),
    });
