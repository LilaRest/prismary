"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    literalSchema: function() {
        return literalSchema;
    },
    jsonSchema: function() {
        return jsonSchema;
    },
    decimalSchema: function() {
        return decimalSchema;
    }
});
const _zod = require("zod");
const _client = require("@prisma/client");
const literalSchema = _zod.z.union([
    _zod.z.string(),
    _zod.z.number(),
    _zod.z.boolean()
]);
const jsonSchema = _zod.z.lazy(()=>_zod.z.union([
        literalSchema,
        _zod.z.array(jsonSchema),
        _zod.z.record(jsonSchema)
    ]));
const decimalSchema = _zod.z// Accept native Prisma.Decimal objects, string or number
.instanceof(_client.Prisma.Decimal).or(_zod.z.string()).or(_zod.z.number())// Ensure the value can be converted to Prisma.Decimal instance
.refine((value)=>{
    try {
        return new _client.Prisma.Decimal(value);
    } catch (error) {
        return false;
    }
})// Finally, ensure the value is a Prisma.Decimal instance
.transform((value)=>new _client.Prisma.Decimal(value));
