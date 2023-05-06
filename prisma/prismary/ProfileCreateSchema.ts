import { z } from "zod";

export const ProfileCreateSchema = z.object({
    bio: z.string(),
    isPrivate: z.boolean(),
    age: z.number().int(),
    userId: z.number().int(),
    user: z.unknown(),
});
