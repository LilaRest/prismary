"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserUpdateSchema", {
    enumerable: true,
    get: function() {
        return UserUpdateSchema;
    }
});
const _zod = require("zod");
const UserUpdateSchema = _zod.z.object({
    email: _zod.z.string().optional(),
    name: _zod.z.string().optional(),
    password: _zod.z.string().optional(),
    profileId: _zod.z.number().int().nullish().optional(),
    profile: _zod.z.unknown().nullish().optional(),
    friends: _zod.z.unknown().array().optional(),
    friendOf: _zod.z.unknown().array().optional(),
    posts: _zod.z.unknown().array().optional(),
    comments: _zod.z.unknown().array().optional()
});
