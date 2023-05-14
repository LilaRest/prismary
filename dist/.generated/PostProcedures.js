"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "userProcedures", {
    enumerable: true,
    get: function() {
        return userProcedures;
    }
});
const _zod = require("zod");
const _server = require("@trpc/server");
const _ability = require("@casl/ability");
const _TRPC_INSTANCE_PATH = require("TRPC_INSTANCE_PATH");
const _PRISMA_INSTANCE_PATH = require("PRISMA_INSTANCE_PATH");
const _CASL_INSTANCE_PATH = require("CASL_INSTANCE_PATH");
const _MODEL_SCHEMAS_PATH = require("MODEL_SCHEMAS_PATH");
const t = _TRPC_INSTANCE_PATH.TRPC_INSTANCE_NAME;
const publicProcedure = t.procedure;
const prisma = _PRISMA_INSTANCE_PATH.PRISMA_INSTANCE_NAME;
const ability = _CASL_INSTANCE_PATH.CASL_INSTANCE_NAME;
const createModelSchema = _MODEL_SCHEMAS_PATH.CREATE_MODEL_SCHEMA;
const updateModelSchema = _MODEL_SCHEMAS_PATH.UPDATE_MODEL_SCHEMA;
const forbiddenError = new _server.TRPCError({
    code: "FORBIDDEN",
    message: "You don't have access to this ressource."
});
const missingError = new _server.TRPCError({
    code: "NOT_FOUND",
    message: "This resource doesn't exist."
});
const notSupportedError = (feature)=>new _server.TRPCError({
        code: "METHOD_NOT_SUPPORTED",
        message: `"${feature}" is not supported yet by Prismary.`
    });
const userProcedures = {
    create: publicProcedure.input((val)=>{
        createModelSchema.parse(val.data);
        return val;
    }).mutation(async ({ input  })=>{
        // TODO: Check for nested "create" and "createMany" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record)
        // BTW: I haven't understood the difference between create and createMany as they both seems to allow creating many rows
        // To do so, loop over relations fields and search if they contain create or createMany statements
        // There is also the connectOrCreate statement (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record)
        // TODO: properly check for "include" statment
        if (input.include) throw notSupportedError("include");
        // If the user can create SOME users
        if (ability.can("create", "User")) return await prisma.placeholder.create(input);
        throw forbiddenError;
    }),
    createMany: publicProcedure.input((val)=>{
        _zod.z.array(createModelSchema).parse(val.data);
        return val;
    }).mutation(async ({ input  })=>{
        // Security note: Nested "create" and "createMany" statements are not checked because not supported with createMany
        // (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-multiple-records-and-multiple-related-records)
        // If the user can create SOME users
        if (ability.can("create", "User")) return await prisma.placeholder.createMany(input);
        throw forbiddenError;
    }),
    // TODO: In find methods checks for "Relations filters" (some, every, none) which could lead to attacker
    // being able to infer some data by testing them (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#relation-filters)
    // TODO: Same thing for "is" and "isNot" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#filter-on--to-one-relations)
    findUnique: publicProcedure.input((val)=>val).query(async ({ input  })=>{
        // TODO: properly check for "include" statment
        if (input.include) throw notSupportedError("include");
        // TODO: properly check for "include" statment
        if (input.select) throw notSupportedError("select");
        // If the user can read SOME users
        if (ability.can("read", "User")) {
            const user = await prisma.placeholder.findUnique(input);
            if (!user) throw missingError;
            // If the user can read THIS user
            if (ability.can("read", (0, _ability.subject)("User", user))) return user;
        }
        throw forbiddenError;
    }),
    findMany: publicProcedure.input((val)=>val).query(async ({ input  })=>{
        // TODO: properly check for "include" statment
        if (input && input.include) throw notSupportedError("include");
        // TODO: properly check for "include" statment
        if (input && input.select) throw notSupportedError("select");
        // If the user can read SOME users
        if (ability.can("read", "User")) {
            const users = await prisma.placeholder.findMany(input);
            if (!users.length) throw missingError;
            // If the user can read THOSE users
            for (const user of users){
                if (!ability.can("read", (0, _ability.subject)("User", user))) throw forbiddenError;
            }
            return users;
        }
        throw forbiddenError;
    }),
    update: publicProcedure.input((val)=>{
        updateModelSchema.parse(val.data);
        return val;
    }).mutation(async ({ input  })=>{
        // TODO: Check for deleteManystatement (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#delete-all-related-records)
        // TODO: Check for nested "update" and "updateMany" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-all-related-records-or-filter)
        // TODO: Check for nested "upsert" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-or-create-a-related-record)
        // TODO: Check for nested "createMany" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-or-create-a-related-record)
        // If the user can update SOME users
        if (ability.can("update", "User")) {
            const findUniqueInput = {
                ...input
            };
            delete findUniqueInput.data;
            const user = await prisma.placeholder.findUnique(findUniqueInput);
            if (!user) throw missingError;
            // If the user can update THIS user
            if (ability.can("update", (0, _ability.subject)("User", user))) return await prisma.placeholder.update(input);
        }
        throw forbiddenError;
    }),
    updateMany: publicProcedure.input((val)=>{
        _zod.z.array(updateModelSchema).parse(val.data);
        return val;
    }).mutation(async ({ input  })=>{
        // If the user can update SOME users
        if (ability.can("update", "User")) {
            const findManyInput = {
                ...input
            };
            delete findManyInput.data;
            const users = await prisma.placeholder.findMany(findManyInput);
            if (!users.length) throw missingError;
            // If the user can update THOSE users
            for (const user of users){
                if (!ability.can("update", (0, _ability.subject)("User", user))) throw forbiddenError;
            }
            return await prisma.placeholder.updateMany(input);
        }
        throw forbiddenError;
    }),
    delete: publicProcedure.input((val)=>val).mutation(async ({ input  })=>{
        // If the user can delete SOME users
        if (ability.can("delete", "User")) {
            const findUniqueInput = {
                ...input
            };
            const user = await prisma.placeholder.findUnique(findUniqueInput);
            if (!user) throw missingError;
            // If the user can delete THIS user
            if (ability.can("delete", (0, _ability.subject)("User", user))) return await prisma.placeholder.delete(input);
        }
        throw forbiddenError;
    }),
    deleteMany: publicProcedure.input((val)=>val).mutation(async ({ input  })=>{
        // If the user can delete SOME users
        if (ability.can("delete", "User")) {
            const findManyInput = {
                ...input
            };
            const users = await prisma.placeholder.findMany(findManyInput);
            if (!users.length) throw missingError;
            // If the user can delete THOSE users
            for (const user of users){
                if (!ability.can("delete", (0, _ability.subject)("User", user))) throw forbiddenError;
            }
            return await prisma.placeholder.deleteMany(input);
        }
        throw forbiddenError;
    })
};
