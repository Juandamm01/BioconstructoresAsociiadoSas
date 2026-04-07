import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// better-auth necesita conexión directa (sin pgbouncer) para sus operaciones internas
// El pool con pgbouncer=true no soporta bien el findFirst usado en getSession
const prismaAuth = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prismaAuth, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
});
