"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostCreateSchema", {
    enumerable: true,
    get: function() {
        return PostCreateSchema;
    }
});
const _zod = require("zod");
const PostCreateSchema = _zod.z.object({
    title: _zod.z.string(),
    content: _zod.z.string(),
    rating: _zod.z.number(),
    authorId: _zod.z.number().int(),
    createdAt: _zod.z.date().optional(),
    author: _zod.z.unknown(),
    comments: _zod.z.unknown().array()
});
