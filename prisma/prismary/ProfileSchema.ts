import { z } from "zod";

export const ProfileSchema = z.object({
        id: z.number().int(),
        bio: z.string(),
        isPrivate: z.boolean(),
        age: z.number().int(),
        userId: z.number().int(),
        user: z.unknown(),
    });
