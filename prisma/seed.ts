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

const productos = [
  {
    categoriaSlug: "flores-importadas",
    nombre: "Ramo de Tulipanes Holandeses",
    slug: "ramo-tulipanes-holandeses",
    descripcion: "Ramo de 15 tulipanes holandeses de importación, en tonos variados.",
    precio: "89.90",
    stock: 15,
    imagenes: ["https://placehold.co/600x400.png?text=Tulipanes"],
  },
  {
    categoriaSlug: "flores-importadas",
    nombre: "Rosas Ecuatorianas Premium",
    slug: "rosas-ecuatorianas-premium",
    descripcion: "Docena de rosas ecuatorianas de tallo largo, variedad premium.",
    precio: "120.00",
    stock: 10,
    imagenes: ["https://placehold.co/600x400.png?text=Rosas"],
  },
  {
    categoriaSlug: "flores-importadas",
    nombre: "Girasoles Importados",
    slug: "girasoles-importados",
    descripcion: "Ramo de 6 girasoles frescos importados.",
    precio: "75.00",
    stock: 20,
    imagenes: ["https://placehold.co/600x400.png?text=Girasoles"],
  },
  {
    categoriaSlug: "flores-importadas",
    nombre: "Orquídeas Phalaenopsis",
    slug: "orquideas-phalaenopsis",
    descripcion: "Orquídea Phalaenopsis en maceta decorativa, importada.",
    precio: "150.00",
    stock: 8,
    imagenes: ["https://placehold.co/600x400.png?text=Orquideas"],
  },
  {
    categoriaSlug: "bocaditos-dulces",
    nombre: "Caja de Alfajores Artesanales",
    slug: "caja-alfajores-artesanales",
    descripcion: "Caja de 12 alfajores artesanales rellenos de manjar blanco.",
    precio: "45.00",
    stock: 30,
    imagenes: ["https://placehold.co/600x400.png?text=Alfajores"],
  },
  {
    categoriaSlug: "bocaditos-dulces",
    nombre: "Brownies Gourmet",
    slug: "brownies-gourmet",
    descripcion: "Caja de 6 brownies gourmet de chocolate belga.",
    precio: "38.00",
    stock: 25,
    imagenes: ["https://placehold.co/600x400.png?text=Brownies"],
  },
  {
    categoriaSlug: "bocaditos-dulces",
    nombre: "Macarons Surtidos",
    slug: "macarons-surtidos",
    descripcion: "Caja de 12 macarons franceses en sabores surtidos.",
    precio: "65.00",
    stock: 18,
    imagenes: ["https://placehold.co/600x400.png?text=Macarons"],
  },
  {
    categoriaSlug: "bocaditos-dulces",
    nombre: "Cupcakes Decorados",
    slug: "cupcakes-decorados",
    descripcion: "Caja de 6 cupcakes decorados a mano.",
    precio: "48.00",
    stock: 20,
    imagenes: ["https://placehold.co/600x400.png?text=Cupcakes"],
  },
  {
    categoriaSlug: "bocaditos-salados",
    nombre: "Tabla de Quesos y Embutidos",
    slug: "tabla-quesos-embutidos",
    descripcion: "Tabla gourmet con selección de quesos y embutidos importados.",
    precio: "95.00",
    stock: 12,
    imagenes: ["https://placehold.co/600x400.png?text=Tabla+Quesos"],
  },
  {
    categoriaSlug: "bocaditos-salados",
    nombre: "Canapés Surtidos",
    slug: "canapes-surtidos",
    descripcion: "Bandeja de 24 canapés surtidos para compartir.",
    precio: "70.00",
    stock: 15,
    imagenes: ["https://placehold.co/600x400.png?text=Canapes"],
  },
  {
    categoriaSlug: "bocaditos-salados",
    nombre: "Empanaditas Gourmet",
    slug: "empanaditas-gourmet",
    descripcion: "Docena de empanaditas gourmet horneadas, sabores surtidos.",
    precio: "55.00",
    stock: 22,
    imagenes: ["https://placehold.co/600x400.png?text=Empanaditas"],
  },
];

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
