import { z } from "zod";

export const PostCreateSchema = z.object({
        title: z.string(),
        content: z.string(),
        rating: z.number(),
        authorId: z.number().int(),
        createdAt: z.date().optional(),
        author: z.unknown(),
        comments: z.unknown().array(),
    });
