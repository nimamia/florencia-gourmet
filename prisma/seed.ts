import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categorias = [
  { nombre: "Flores importadas", slug: "flores-importadas" },
  { nombre: "Bocaditos dulces", slug: "bocaditos-dulces" },
  { nombre: "Bocaditos salados", slug: "bocaditos-salados" },
];

const productos: never[] = [];

async function main() {
  const categoriaIdPorSlug = new Map<string, string>();

  for (const categoria of categorias) {
    const creada = await prisma.categoria.upsert({
      where: { slug: categoria.slug },
      update: { nombre: categoria.nombre },
      create: categoria,
    });
    categoriaIdPorSlug.set(categoria.slug, creada.id);
  }

  for (const producto of productos) {
    const categoriaId = categoriaIdPorSlug.get(producto.categoriaSlug);
    if (!categoriaId) throw new Error(`Categoría no encontrada: ${producto.categoriaSlug}`);

    const creado = await prisma.producto.upsert({
      where: { slug: producto.slug },
      update: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId,
      },
      create: {
        nombre: producto.nombre,
        slug: producto.slug,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId,
      },
    });

    await prisma.imagenProducto.deleteMany({ where: { productoId: creado.id } });
    await prisma.imagenProducto.createMany({
      data: producto.imagenes.map((url, index) => ({
        productoId: creado.id,
        url,
        orden: index,
      })),
    });
  }

  console.log(`Seed completo: ${categorias.length} categorías, ${productos.length} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
