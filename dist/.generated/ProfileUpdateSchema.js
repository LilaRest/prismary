"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProfileUpdateSchema", {
    enumerable: true,
    get: function() {
        return ProfileUpdateSchema;
    }
});
const _zod = require("zod");
const ProfileUpdateSchema = _zod.z.object({
    bio: _zod.z.string().optional(),
    isPrivate: _zod.z.boolean().optional(),
    age: _zod.z.number().int().optional(),
    userId: _zod.z.number().int().optional(),
    user: _zod.z.unknown().optional()
});
