import { z } from "zod";

export const UserUpdateSchema = z.object({
    email: z.string().optional(),
    password: z.string().optional(),
    profileId: z.number().int().nullish().optional(),
    profile: z.unknown().nullish().optional(),
    friends: z.unknown().array().optional(),
    friendOf: z.unknown().array().optional(),
    posts: z.unknown().array().optional(),
    comments: z.unknown().array().optional(),
});
