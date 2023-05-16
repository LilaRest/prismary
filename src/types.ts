import { modelsSpecs } from "./.generated";

export type Action = "create" | "read" | "update" | "delete" | "manage";

export type Model = keyof typeof modelsSpecs;