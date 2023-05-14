"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserCreateSchema", {
    enumerable: true,
    get: function() {
        return UserCreateSchema;
    }
});
const _zod = require("zod");
const UserCreateSchema = _zod.z.object({
    email: _zod.z.string(),
    name: _zod.z.string(),
    password: _zod.z.string(),
    profileId: _zod.z.number().int().nullish(),
    profile: _zod.z.unknown().nullish(),
    friends: _zod.z.unknown().array(),
    friendOf: _zod.z.unknown().array(),
    posts: _zod.z.unknown().array(),
    comments: _zod.z.unknown().array()
});
