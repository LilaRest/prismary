import { z } from 'zod';
import { initTRPC, TRPCError } from "@trpc/server";
import { PrismaClient } from '@prisma/client';
import { PureAbility, subject } from '@casl/ability';
import { PrismaQuery } from '@casl/prisma';
//@ts-ignore
import { TRPC_INSTANCE_NAME } from "TRPC_INSTANCE_PATH";
const t: ReturnType<typeof initTRPC.create> = TRPC_INSTANCE_NAME;
const publicProcedure = t.procedure;

//@ts-ignore
import { PRISMA_INSTANCE_NAME } from "PRISMA_INSTANCE_PATH";
const prisma: PrismaClient = PRISMA_INSTANCE_NAME;

//@ts-ignore
import { CASL_INSTANCE_NAME } from "CASL_INSTANCE_PATH";
type AppAbility = PureAbility<[string, any], PrismaQuery>;
const ability: AppAbility = CASL_INSTANCE_NAME;

//@ts-ignore
import { CREATE_MODEL_SCHEMA, UPDATE_MODEL_SCHEMA } from 'MODEL_SCHEMAS_PATH';
const createModelSchema: ReturnType<typeof z.object> = CREATE_MODEL_SCHEMA;
const updateModelSchema: ReturnType<typeof z.object> = UPDATE_MODEL_SCHEMA;

const forbiddenError = new TRPCError({
  code: "FORBIDDEN",
  message: "You don't have access to this ressource."
});

const missingError = new TRPCError({
  code: "NOT_FOUND",
  message: "This resource doesn't exist."
});

const notSupportedError = (feature: string) => new TRPCError({
  code: "METHOD_NOT_SUPPORTED",
  message: `"${feature}" is not supported yet by Prismary.`
});

// The whole Prisma Client API reference is here: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference

export const userProcedures = {
  create: publicProcedure
    .input((val: any) => {
      createModelSchema.parse(val.data);
      return val as Parameters<typeof prisma.placeholder.create>[0];
    })
    .mutation(async ({ input }) => {
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
  createMany: publicProcedure
    .input((val: any) => {
      z.array(createModelSchema).parse(val.data);
      return val as Parameters<typeof prisma.placeholder.createMany>[0];
    })
    .mutation(async ({ input }) => {
      // Security note: Nested "create" and "createMany" statements are not checked because not supported with createMany
      // (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-multiple-records-and-multiple-related-records)

      // If the user can create SOME users
      if (ability.can("create", "User")) return await prisma.placeholder.createMany(input);
      throw forbiddenError;
    }),

  // TODO: In find methods checks for "Relations filters" (some, every, none) which could lead to attacker
  // being able to infer some data by testing them (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#relation-filters)
  // TODO: Same thing for "is" and "isNot" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#filter-on--to-one-relations)
  findUnique: publicProcedure
    .input((val: any) => val as Parameters<typeof prisma.placeholder.findUnique>[0])
    .query(async ({ input }) => {
      // TODO: properly check for "include" statment
      if (input.include) throw notSupportedError("include");
      // TODO: properly check for "include" statment
      if (input.select) throw notSupportedError("select");

      // If the user can read SOME users
      if (ability.can("read", "User")) {
        const user = await prisma.placeholder.findUnique(input);
        if (!user) throw missingError;
        // If the user can read THIS user
        if (ability.can("read", subject("User", user))) return user;
      }
      throw forbiddenError;
    }),
  findMany: publicProcedure
    .input((val: any) => val as Parameters<typeof prisma.placeholder.findMany>[0])
    .query(async ({ input }) => {
      // TODO: properly check for "include" statment
      if (input && input.include) throw notSupportedError("include");
      // TODO: properly check for "include" statment
      if (input && input.select) throw notSupportedError("select");

      // If the user can read SOME users
      if (ability.can("read", "User")) {
        const users = await prisma.placeholder.findMany(input);
        if (!users.length) throw missingError;
        // If the user can read THOSE users
        for (const user of users) {
          if (!ability.can("read", subject("User", user))) throw forbiddenError;
        }
        return users;
      }
      throw forbiddenError;
    }),

  update: publicProcedure
    .input((val: any) => {
      updateModelSchema.parse(val.data);
      return val as Parameters<typeof prisma.placeholder.update>[0];
    })
    .mutation(async ({ input }) => {
      // TODO: Check for deleteManystatement (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#delete-all-related-records)
      // TODO: Check for nested "update" and "updateMany" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-all-related-records-or-filter)
      // TODO: Check for nested "upsert" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-or-create-a-related-record)
      // TODO: Check for nested "createMany" statements (see: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-or-create-a-related-record)

      // If the user can update SOME users
      if (ability.can("update", "User")) {
        const findUniqueInput = { ...input } as any;
        delete findUniqueInput.data;
        const user = await prisma.placeholder.findUnique(findUniqueInput as Parameters<typeof prisma.placeholder.findUnique>[0]);
        if (!user) throw missingError;
        // If the user can update THIS user
        if (ability.can("update", subject("User", user))) return await prisma.placeholder.update(input);
      }
      throw forbiddenError;
    }),
  updateMany: publicProcedure
    .input((val: any) => {
      z.array(updateModelSchema).parse(val.data);
      return val as Parameters<typeof prisma.placeholder.updateMany>[0];
    })
    .mutation(async ({ input }) => {
      // If the user can update SOME users
      if (ability.can("update", "User")) {
        const findManyInput = { ...input } as any;
        delete findManyInput.data;

        const users = await prisma.placeholder.findMany(findManyInput as Parameters<typeof prisma.placeholder.findMany>[0]);
        if (!users.length) throw missingError;

        // If the user can update THOSE users
        for (const user of users) {
          if (!ability.can("update", subject("User", user))) throw forbiddenError;
        }
        return await prisma.placeholder.updateMany(input);
      }
      throw forbiddenError;
    }),

  delete: publicProcedure
    .input((val: any) => val as Parameters<typeof prisma.placeholder.delete>[0])
    .mutation(async ({ input }) => {
      // If the user can delete SOME users
      if (ability.can("delete", "User")) {
        const findUniqueInput = { ...input } as Parameters<typeof prisma.placeholder.findUnique>[0];
        const user = await prisma.placeholder.findUnique(findUniqueInput);
        if (!user) throw missingError;

        // If the user can delete THIS user
        if (ability.can("delete", subject("User", user))) return await prisma.placeholder.delete(input);
      }
      throw forbiddenError;
    }),
  deleteMany: publicProcedure
    .input((val: any) => val as Parameters<typeof prisma.placeholder.deleteMany>[0])
    .mutation(async ({ input }) => {
      // If the user can delete SOME users
      if (ability.can("delete", "User")) {
        const findManyInput = { ...input } as Parameters<typeof prisma.placeholder.findMany>[0];
        const users = await prisma.placeholder.findMany(findManyInput);
        if (!users.length) throw missingError;

        // If the user can delete THOSE users
        for (const user of users) {
          if (!ability.can("delete", subject("User", user))) throw forbiddenError;
        }
        return await prisma.placeholder.deleteMany(input);
      }
      throw forbiddenError;
    }),
};
