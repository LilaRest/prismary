import { type SetToUnion } from "./utils/other";
import { type Action } from "./types";

/**
 * - Conflicting clauses
 *   - set:
 *     - Nested queries -> "update" relation key & "infer" keys of set objects
 *     - Scalar list methods -> "update" list key
 *     - Composite type methods -> "update" composite key
 *     - Atomic number operations -> "update" number key
 *   - push: 
 *     - Scalar list methods -> "update" list key
 *     - Composite type methods -> "update" composite key
 *   - unset: 
 *     - Scalar list methods -> "update" list key
 *     - Composite type methods -> "update" composite key
 *   - some:
 *     - Composite type methods -> "infer" composite key
 *     - Relation filters -> "infer" composite key & "infer" key of nested object
 *   - every:
 *     - Composite type methods -> "infer" composite key
 *     - Relation filters -> "infer" composite key & "infer" key of nested object
 *   - none:
 *     - Composite type methods -> "infer" composite key
 *     - Relation filters -> "infer" composite key & "infer" key of nested object
 *   - is:
 *     - Composite type methods -> "infer" composite key
 *     - Relation filters -> "infer" composite key & "infer" key of nested object
 *   - isNot:
 *     - Composite type methods -> "infer" composite key
 *     - Relation filters -> "infer" composite key & "infer" key of nested object
 */

// Lists all Prisma Client query methods + all clauses available in methods body argument.
export const clauses = new Set([
  // Deprecated
  "rejectOnNotFound",
  // Model queries
  "findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "findMany", "create", "update", "upsert", "delete", "createMany", "updateMany", "deleteMany", "count", "aggregate", "groupBy",
  // Model query options
  "select", "include", "where", "orderBy", "distinct",
  // Additional model query options
  "rejectOnNotFound", "cursor", "skip", "take", "data", "create", "update", "skipDuplicates", "_count", "_avg", "_sum", "_min", "_max", "by", "having", "sort", "nulls", "_relevance", "fields", "search", "sort",
  // Nested queries
  "create", "createMany", "set", "connect", "connectOrCreate", "disconnect", "update", "upsert", "delete", "updateMany", "deleteMany",
  // Filter conditions and operators
  "equals", "not", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "search", "mode", "startsWith", "endsWith", "AND", "OR", "NOT",
  // Relation filters
  "some", "every", "none", "is", "isNot",
  // Scalar list methods
  "set", "push", "unset",
  // Scalar list filters
  "has", "hasEvery", "hasSome", "isEmpty", "isSet", "equals",
  // Composite type methods
  "set", "unset", "update", "upsert", "push",
  // Composite type filters
  "equals", "is", "isNot", "isEmpty", "every", "some", "none",
  // Atomic number operations > operators
  "increment", "decrement", "multiply", "divide", "set",
  // JSON filters 
  "path", "string_contains", "string_starts_with", "string_ends_with", "array_contains", "array_starts_with", "array_ends_with",
] as const);
export type Clause = SetToUnion<typeof parentClauses>;


// Lists all Prisma Client API model methods names.
export const methodClauses = new Set(["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "findMany", "create", "update", "upsert", "delete", "createMany", "updateMany", "deleteMany", "count", "aggregate", "groupBy"]);
export type MethodClause = SetToUnion<typeof methodClauses>;

// Lists all clauses that change the permissions context.
export const parentClauses = new Set([
  // Model queries
  "findUnique", "findFirst", "findMany", "create", "update", "delete", "createMany", "updateMany", "deleteMany", "count",

  // Nested queries
  "create", "createMany", "set", "connect", "disconnect", "update", "delete", "updateMany", "deleteMany",

  // Scalar list methods
  "set", "push", "unset",

  // Composite type methods
  "set", "unset", "update", "push",

  // Model query options
  "select", "include", "where", "orderBy", "distinct",

  // Others
  "cursor"
] as const);
export type ParentClause = SetToUnion<typeof parentClauses>;


// Lists all clauses that extend the parent clause permissions context.
export const extendClauses = new Set([

  // Nested queries & Composite type methods
  // (because always includes "create", "update" or "set" clauses that will define required create and update context)
  "upsert",

  // Relation filters
  "some", "every", "none", "is", "isNot",

  // Atomic number operations
  // (because only available under "update" clause or query)
  "increment", "decrement", "multiply", "divide", "set",

  // Where operators
  // (because only available under "where" clause)
  "AND", "OR", "NOT",

  // Data clause
  // (because only available as top-level clause of "update", "updateMany", "create", "createMany" clauses and queries)
  "data"
] as const);
export type ExtendClause = SetToUnion<typeof extendClauses>;


// Lists all clauses that are ignored during validation process.
export const ignoredClauses = new Set([
  // Filter condtions (Scalar filters)
  "equals", "not", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "search", "mode", "startsWith",
  "endsWith",

  // Scalar list filters (List filters)
  "has", "hasEvery", "hasSome", "isEmpty", "isSet", "equals",

  // Composite type filters
  "equals", "is", "isNot", "isEmpty", "every", "some", "none",

  // JSON filters
  "path", "string_contains", "string_starts_with", "string_ends_with", "array_contains", "array_starts_with", "array_ends_with",

  // Other
  "skip", "take", "skipDuplicates"
] as const);
export type IgnoredClause = SetToUnion<typeof ignoredClauses>;


// Lists all clauses that are currently not supported by Prismary.
export const notSupportedClauses = new Set([
  // Model queries
  "findUniqueOrThrow", "findFirstOrThrow", "aggregate", "groupBy",

  // Other
  "rejectOnNotFound"
] as const);
export type NotSupportedClause = SetToUnion<typeof notSupportedClauses>;


export const notSupportedClausesReasons = {
  findUniqueOrThrow: "Because tRPC endpoints should consitently return TRPCError and not a mixture of these and Prisma errors. Use findUnique() instead, and listen for TRPC 'NOT_FOUND' error code.",
  findFirstOrThrow: "Because tRPC endpoints should consitently return TRPCError and not a mixture of these and Prisma errors. Use findFirst() instead, and listen for TRPC 'NOT_FOUND' error code",
  aggregate: "Its implementation is planned on the roadmap and should come soon.",
  groupBy: "Its implementation is planned on the roadmap and should come soon.",
  rejectOnNotFound: "Because tRPC endpoints should consitently return TRPCError and not a mixture of these and Prisma errors. Listen for TRPC 'NOT_FOUND' error code instead."
} as { [key: string]: string; };


export const supportsWhereClauses = new Set(["findMany", "connectOrCreate"] as const);

export type SupportWhereClause = SetToUnion<typeof supportsWhereClauses>;




export const parentClausesActions: Record<ParentClause, Array<Action>> = {
  findUnique: ["read"],
  findFirst: ["read"],
  findMany: ["read"],
  create: ["create"],
  update: ["update"],
  delete: ["delete"],
  createMany: ["create"],
  updateMany: ["update"],
  deleteMany: ["delete"],
  count: ["read"],
  set: ["update"],
  connect: ["update"],
  disconnect: ["update"],
  push: ["update"],
  unset: ["read"],
  select: ["read"],
  include: ["read"],
  where: ["read"],
  orderBy: ["read"],
  distinct: ["read"],
  cursor: ["read"]
};