"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentUpdateSchema", {
    enumerable: true,
    get: function() {
        return CommentUpdateSchema;
    }
});
const _zod = require("zod");
const CommentUpdateSchema = _zod.z.object({
    message: _zod.z.string().optional(),
    createdAt: _zod.z.date().optional(),
    postId: _zod.z.number().int().optional(),
    authorId: _zod.z.number().int().optional(),
    post: _zod.z.unknown().optional(),
    author: _zod.z.unknown().optional()
});
