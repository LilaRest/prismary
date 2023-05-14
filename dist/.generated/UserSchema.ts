import { z } from "zod";

export const UserSchema = z.object({
        id: z.number().int(),
        email: z.string(),
        name: z.string(),
        password: z.string(),
        profileId: z.number().int().nullish(),
        profile: z.unknown().nullish(),
        friends: z.unknown().array(),
        friendOf: z.unknown().array(),
        posts: z.unknown().array(),
        comments: z.unknown().array(),
    });
