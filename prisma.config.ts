// prisma.config.ts
import dotenv from "dotenv";

// 🔥 Forzar uso de .env.local
dotenv.config({ path: ".env.local" });

// Exportar la configuración como un objeto normal
export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!, // ahora sí lee de .env.local
  },
};