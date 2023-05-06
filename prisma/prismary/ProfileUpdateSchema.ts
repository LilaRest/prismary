import { z } from "zod";

export const ProfileUpdateSchema = z.object({
    bio: z.string().optional(),
    isPrivate: z.boolean().optional(),
    age: z.number().int().optional(),
    userId: z.number().int().optional(),
    user: z.unknown().optional(),
});
