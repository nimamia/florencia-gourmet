import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type ItemDual = { nombre: string; precio_medio_ciento_50u: number; precio_ciento_100u: number };
type ItemUnidad = { nombre: string; precio_unidad: number };
type ItemFijo = { nombre: string; precio: number };
type Item = ItemDual | ItemUnidad | ItemFijo;

type Data = {
  bocaditos_salados: Item[];
  bocaditos_dulces: Item[];
  combos_mixtos: ItemFijo[];
};

const STOCK_DEFAULT = 20;

const TILDES: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u", ñ: "n", ü: "u",
};

function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .replace(/[áéíóúñü]/g, (c) => TILDES[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function construirProducto(item: Item) {
  if ("precio_medio_ciento_50u" in item) {
    return {
      nombre: item.nombre,
      slug: slugify(item.nombre),
      descripcion: `${item.nombre}. Presentación medio ciento (50 unidades).`,
      precio: item.precio_medio_ciento_50u.toFixed(2),
      precioPorMayor: item.precio_ciento_100u.toFixed(2),
      cantidadPorMayor: 100,
    };
  }
  if ("precio_unidad" in item) {
    return {
      nombre: item.nombre,
      slug: slugify(item.nombre),
      descripcion: `${item.nombre}, precio por unidad.`,
      precio: item.precio_unidad.toFixed(2),
      precioPorMayor: null,
      cantidadPorMayor: null,
    };
  }
  return {
    nombre: item.nombre,
    slug: slugify(item.nombre),
    descripcion: item.nombre,
    precio: item.precio.toFixed(2),
    precioPorMayor: null,
    cantidadPorMayor: null,
  };
}

async function main() {
  const data: Data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "data/bocaditos.json"), "utf-8"),
  );

  const categoria = await prisma.categoria.upsert({
    where: { slug: "dulces-y-salados" },
    update: {},
    create: { nombre: "Dulces y Salados", slug: "dulces-y-salados", orden: 1 },
  });

  const items = [...data.bocaditos_salados, ...data.bocaditos_dulces, ...data.combos_mixtos];

  let total = 0;

  for (const item of items) {
    const p = construirProducto(item);

    await prisma.producto.upsert({
      where: { slug: p.slug },
      update: {
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        precioPorMayor: p.precioPorMayor,
        cantidadPorMayor: p.cantidadPorMayor,
        categoriaId: categoria.id,
      },
      create: {
        nombre: p.nombre,
        slug: p.slug,
        descripcion: p.descripcion,
        precio: p.precio,
        precioPorMayor: p.precioPorMayor,
        cantidadPorMayor: p.cantidadPorMayor,
        stock: STOCK_DEFAULT,
        estado: "ACTIVO",
        categoriaId: categoria.id,
      },
    });

    total += 1;
    console.log(`OK  ${p.nombre}  S/${p.precio}${p.precioPorMayor ? ` (por mayor S/${p.precioPorMayor} x${p.cantidadPorMayor})` : ""}`);
  }

  console.log(`\nListo: ${total} productos de bocaditos importados/actualizados.`);
  console.log("Quedaron ACTIVOS con stock por defecto de " + STOCK_DEFAULT + " (ajustable en el admin).");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
