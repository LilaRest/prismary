"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentCreateSchema", {
    enumerable: true,
    get: function() {
        return CommentCreateSchema;
    }
});
const _zod = require("zod");
const CommentCreateSchema = _zod.z.object({
    message: _zod.z.string(),
    createdAt: _zod.z.date().optional(),
    postId: _zod.z.number().int(),
    authorId: _zod.z.number().int(),
    post: _zod.z.unknown(),
    author: _zod.z.unknown()
});
