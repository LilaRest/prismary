import { z } from "zod";

export const PostSchema = z.object({
    id: z.number().int(),
    title: z.string(),
    content: z.string(),
    rating: z.number(),
    authorId: z.number().int(),
    createdAt: z.date(),
    author: z.unknown(),
    comments: z.unknown().array(),
});
