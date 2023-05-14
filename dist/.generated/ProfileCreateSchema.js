"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProfileCreateSchema", {
    enumerable: true,
    get: function() {
        return ProfileCreateSchema;
    }
});
const _zod = require("zod");
const ProfileCreateSchema = _zod.z.object({
    bio: _zod.z.string(),
    isPrivate: _zod.z.boolean(),
    age: _zod.z.number().int(),
    userId: _zod.z.number().int(),
    user: _zod.z.unknown()
});
