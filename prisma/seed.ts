import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categorias = [
  { nombre: "Flores importadas", slug: "flores-importadas" },
  { nombre: "Dulces y Salados", slug: "dulces-y-salados" },
];

async function main() {
  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { slug: categoria.slug },
      update: { nombre: categoria.nombre },
      create: categoria,
    });
  }

  console.log(`Seed completo: ${categorias.length} categorías.`);
  console.log(
    "El catálogo de productos real se carga con scripts/importar-flores.ts y scripts/importar-bocaditos.ts.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
