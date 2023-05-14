"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentSchema", {
    enumerable: true,
    get: function() {
        return CommentSchema;
    }
});
const _zod = require("zod");
const CommentSchema = _zod.z.object({
    id: _zod.z.number().int(),
    message: _zod.z.string(),
    createdAt: _zod.z.date(),
    postId: _zod.z.number().int(),
    authorId: _zod.z.number().int(),
    post: _zod.z.unknown(),
    author: _zod.z.unknown()
});
