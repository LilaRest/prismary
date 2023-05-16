import { PrismaClient } from "@prisma/client";
import { defineConfig } from "prismary";
import { initTRPC } from "@trpc/server";

const prisma = new PrismaClient({});
const t = initTRPC.create({});

defineConfig({
  prismaClientInstance: prisma,
  trcpBackendInstance: t
});