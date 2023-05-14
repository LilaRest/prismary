"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProfileSchema", {
    enumerable: true,
    get: function() {
        return ProfileSchema;
    }
});
const _zod = require("zod");
const ProfileSchema = _zod.z.object({
    id: _zod.z.number().int(),
    bio: _zod.z.string(),
    isPrivate: _zod.z.boolean(),
    age: _zod.z.number().int(),
    userId: _zod.z.number().int(),
    user: _zod.z.unknown()
});
