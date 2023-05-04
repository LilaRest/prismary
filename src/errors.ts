import { TRPCError } from "@trpc/server";
import { type Action } from "./types";

export const ForbiddenError = (action: Action, subject: string) => new TRPCError({
  code: "FORBIDDEN",
  message: `You're not allowed to ${action} this ressource ("${subject}").`
});

export const MissingError = (subject: string) => new TRPCError({
  code: "NOT_FOUND",
  message: `This resource doesn't exist ("${subject}").`
});

export const NotSupportedError = (feature: string, reason: string) => new TRPCError({
  code: "METHOD_NOT_SUPPORTED",
  message: `"${feature}" is actually not supported by Prismary. ${reason}`
});