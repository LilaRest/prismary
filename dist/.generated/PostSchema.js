"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostSchema", {
    enumerable: true,
    get: function() {
        return PostSchema;
    }
});
const _zod = require("zod");
const PostSchema = _zod.z.object({
    id: _zod.z.number().int(),
    title: _zod.z.string(),
    content: _zod.z.string(),
    rating: _zod.z.number(),
    authorId: _zod.z.number().int(),
    createdAt: _zod.z.date(),
    author: _zod.z.unknown(),
    comments: _zod.z.unknown().array()
});
