import { z } from "zod";

export const CommentSchema = z.object({
    id: z.number().int(),
    text: z.string(),
    createdAt: z.date(),
    postId: z.number().int(),
    authorId: z.number().int(),
    post: z.unknown(),
    author: z.unknown(),
});
