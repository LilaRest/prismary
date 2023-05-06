import { z } from "zod";

export const UserCreateSchema = z.object({
    email: z.string(),
    password: z.string(),
    profileId: z.number().int().nullish(),
    profile: z.unknown().nullish(),
    friends: z.unknown().array(),
    friendOf: z.unknown().array(),
    posts: z.unknown().array(),
    comments: z.unknown().array(),
});
