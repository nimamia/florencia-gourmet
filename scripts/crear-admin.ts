import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];

async function main() {
  if (!EMAIL || !PASSWORD) {
    console.error("Uso: npx tsx scripts/crear-admin.ts <email> <password>");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });

  if (error || !data.user) {
    console.error("Error creando usuario en Supabase Auth:", error?.message);
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const nombre = EMAIL.split("@")[0].replace(/[._-]/g, " ");

  await prisma.usuarioAdmin.upsert({
    where: { id: data.user.id },
    update: { email: EMAIL, activo: true },
    create: {
      id: data.user.id,
      email: EMAIL,
      nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1),
      activo: true,
    },
  });

  console.log(`Usuario admin creado: ${EMAIL} (id: ${data.user.id})`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
