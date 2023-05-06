import { z } from "zod";

export const CommentCreateSchema = z.object({
    text: z.string(),
    createdAt: z.date().optional(),
    postId: z.number().int(),
    authorId: z.number().int(),
    post: z.unknown(),
    author: z.unknown(),
});
