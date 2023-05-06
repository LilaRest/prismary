import { z } from "zod";

export const CommentUpdateSchema = z.object({
        text: z.string().optional(),
        createdAt: z.date().optional(),
        postId: z.number().int().optional(),
        authorId: z.number().int().optional(),
        post: z.unknown().optional(),
        author: z.unknown().optional(),
    });
