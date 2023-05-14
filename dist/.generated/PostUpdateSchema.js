"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostUpdateSchema", {
    enumerable: true,
    get: function() {
        return PostUpdateSchema;
    }
});
const _zod = require("zod");
const PostUpdateSchema = _zod.z.object({
    title: _zod.z.string().optional(),
    content: _zod.z.string().optional(),
    rating: _zod.z.number().optional(),
    authorId: _zod.z.number().int().optional(),
    createdAt: _zod.z.date().optional(),
    author: _zod.z.unknown().optional(),
    comments: _zod.z.unknown().array().optional()
});
