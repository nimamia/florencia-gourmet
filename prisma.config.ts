import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js convention: real secrets live in .env.local (gitignored).
loadEnv({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // CLI (migrate/introspect) needs a direct, non-pooled connection.
  // The app runtime (src/lib/prisma.ts) connects via the pooled DATABASE_URL instead.
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
