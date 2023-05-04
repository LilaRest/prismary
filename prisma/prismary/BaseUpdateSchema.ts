import { z } from "zod";

export const BaseUpdateSchema = z.object({
        user: z.unknown().optional(),
    });
