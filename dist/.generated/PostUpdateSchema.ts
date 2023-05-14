import { z } from "zod";

export const PostUpdateSchema = z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        rating: z.number().optional(),
        authorId: z.number().int().optional(),
        createdAt: z.date().optional(),
        author: z.unknown().optional(),
        comments: z.unknown().array().optional(),
    });
