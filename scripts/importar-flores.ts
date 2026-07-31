import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });

const CARPETA_FOTOS = path.resolve(
  __dirname,
  "../../fotos/renombradas",
);

const CATEGORIA_SLUG = "flores-importadas";

// Slugs de los productos placeholder de flores que se reemplazan por el catálogo real.
const SLUGS_PLACEHOLDER = [
  "ramo-tulipanes-holandeses",
  "rosas-ecuatorianas-premium",
  "girasoles-importados",
  "orquideas-phalaenopsis",
];

type ProductoFlor = {
  slug: string;
  nombre: string;
  descripcion: string;
  archivos: string[];
};

const PRODUCTOS: ProductoFlor[] = [
  {
    slug: "rosas-garden-candy-x-pression",
    nombre: "Rosas Garden Candy X-Pression",
    descripcion: "Rosas Garden variedad Candy X-Pression, importadas, de tallo largo.",
    archivos: ["Rosas_Garden_Candy_X_Pression.jpg"],
  },
  {
    slug: "rosas-garden-mandarin-x-pression",
    nombre: "Rosas Garden Mandarin X-Pression",
    descripcion: "Rosas Garden variedad Mandarin X-Pression, importadas, de tallo largo.",
    archivos: ["Rosas_Garden_Mandarin_X_Pression.jpg"],
  },
  {
    slug: "rosa-purple-haze",
    nombre: "Rosa Purple Haze",
    descripcion: "Rosas importadas variedad Purple Haze, tono lila característico.",
    archivos: ["Rosas_Rosa_Purple_Haze.jpg"],
  },
  {
    slug: "rosa-anastasia-blanco",
    nombre: "Rosa Anastasia Blanco",
    descripcion: "Rosas importadas variedad Anastasia, color blanco, de tallo largo.",
    archivos: ["Rosas_Anastasia_Blanco.jpg"],
  },
  {
    slug: "rosa-arcoiris",
    nombre: "Rosa Arcoíris",
    descripcion: "Rosas importadas teñidas en tonos arcoíris.",
    archivos: ["Rosas_Rosa_Arcoiris.jpg"],
  },
  {
    slug: "rosas-azules",
    nombre: "Rosas Azules",
    descripcion: "Rosas importadas teñidas en tono azul.",
    archivos: ["Rosas_Rosas_Azul.jpg"],
  },
  {
    slug: "rosa-preservada-tallo-largo",
    nombre: "Rosa Preservada Tallo Largo",
    descripcion: "Rosa preservada de tallo largo, mantiene su belleza por mucho más tiempo que una rosa fresca.",
    archivos: ["Rosas_Preservadas_Rosa_Preservada_Tallo_Largo.jpg"],
  },
  {
    slug: "babyroses",
    nombre: "Babyroses",
    descripcion: "Babyroses importadas, ideales para ramos y arreglos florales.",
    archivos: ["Babyroses_Babyroses_01.jpg", "Babyroses_Babyroses_02.jpg"],
  },
  {
    slug: "baby-rosa",
    nombre: "Baby Rosa",
    descripcion: "Baby Rosa importada, flor pequeña ideal para complementar arreglos.",
    archivos: ["Babyroses_Baby_Rosa.jpg"],
  },
  {
    slug: "lilium-oriental-sorbone",
    nombre: "Lilium Oriental Sorbone",
    descripcion: "Lilium oriental variedad Sorbone, importado, aromático.",
    archivos: ["Lilium_Liliun_Oriental_Sorbone.jpg"],
  },
  {
    slug: "lilium-oriental-perfumado",
    nombre: "Lilium Oriental Perfumado",
    descripcion: "Lilium oriental perfumado, importado.",
    archivos: ["Lilium_Liliun_Oriental_Perfumado.jpg"],
  },
  {
    slug: "lilium-asiatico-pavia",
    nombre: "Lilium Asiático Pavía",
    descripcion: "Lilium asiático variedad Pavía, importado.",
    archivos: ["Lilium_Liliun_Asiatico_Pavia.jpg"],
  },
  {
    slug: "lilium-asiatico",
    nombre: "Lilium Asiático",
    descripcion: "Lilium asiático importado.",
    archivos: ["Lilium_Liliun_Asiatico.jpg"],
  },
  {
    slug: "lilium-asiatico-naranja-melon",
    nombre: "Lilium Asiático Naranja Melón",
    descripcion: "Lilium asiático importado, tono naranja melón.",
    archivos: ["Lilium_Lilium_Asiatico_Naranja_Melon.jpg"],
  },
  {
    slug: "gerbera-importada",
    nombre: "Gerbera Importada",
    descripcion: "Gerberas importadas de colores variados.",
    archivos: ["Gerbera_Gerbera_Importada_01.jpg", "Gerbera_Gerbera_Importada_02.jpg"],
  },
  {
    slug: "gerbera-importada-amarilla",
    nombre: "Gerbera Importada Amarilla",
    descripcion: "Gerbera importada, color amarillo.",
    archivos: ["Gerbera_Gerbera_Importada_Amarillo.jpg"],
  },
  {
    slug: "gipsofilia-250-gramos",
    nombre: "Gipsofilia 250 Gramos",
    descripcion: "Gipsofilia (\"nube\"), presentación de 250 gramos, ideal como relleno para ramos.",
    archivos: ["Gipsofilia_Gipsofilia_250_Gramos.jpg"],
  },
  {
    slug: "follaje-hypericum",
    nombre: "Follaje Hypericum",
    descripcion: "Follaje Hypericum importado, complemento decorativo para arreglos florales.",
    archivos: ["Follaje_Hymperico.jpg"],
  },
  {
    slug: "follaje-ruscus-importado",
    nombre: "Follaje Ruscus Importado",
    descripcion: "Follaje Ruscus importado, verde y de larga duración, ideal como base de arreglos.",
    archivos: ["Follaje_Ruscus_Importados.jpg"],
  },
  {
    slug: "crisantemo-petruska",
    nombre: "Crisantemo Petruska",
    descripcion: "Crisantemo variedad Petruska, importado.",
    archivos: ["Crisantemo_Crisantemo_Petruska.jpg"],
  },
];

const CONTENT_TYPE_POR_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function main() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET!;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const categoria = await prisma.categoria.upsert({
    where: { slug: CATEGORIA_SLUG },
    update: {},
    create: { nombre: "Flores importadas", slug: CATEGORIA_SLUG, orden: 0 },
  });

  const { count: eliminados } = await prisma.producto.deleteMany({
    where: { slug: { in: SLUGS_PLACEHOLDER } },
  });
  console.log(`Placeholders de flores eliminados: ${eliminados}`);

  for (const producto of PRODUCTOS) {
    const urls: string[] = [];

    for (const archivo of producto.archivos) {
      const rutaLocal = path.join(CARPETA_FOTOS, archivo);
      const buffer = fs.readFileSync(rutaLocal);
      const ext = path.extname(archivo).toLowerCase();
      const contentType = CONTENT_TYPE_POR_EXT[ext] ?? "application/octet-stream";
      const rutaStorage = `flores-importadas/${archivo}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(rutaStorage, buffer, { contentType, upsert: true });

      if (error) {
        throw new Error(`Error subiendo ${archivo}: ${error.message}`);
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(rutaStorage);
      urls.push(data.publicUrl);
    }

    const creado = await prisma.producto.upsert({
      where: { slug: producto.slug },
      update: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoriaId: categoria.id,
      },
      create: {
        nombre: producto.nombre,
        slug: producto.slug,
        descripcion: producto.descripcion,
        precio: "0.00",
        stock: 0,
        estado: "INACTIVO",
        categoriaId: categoria.id,
      },
    });

    await prisma.imagenProducto.deleteMany({ where: { productoId: creado.id } });
    await prisma.imagenProducto.createMany({
      data: urls.map((url, index) => ({
        productoId: creado.id,
        url,
        orden: index,
      })),
    });

    console.log(`OK  ${producto.nombre}  (${urls.length} imagen/es)`);
  }

  console.log(
    `\nListo: ${PRODUCTOS.length} productos importados con fotos reales, categoría "Flores importadas".`,
  );
  console.log(
    "Quedaron INACTIVOS con precio S/0.00 y stock 0 — completa precio/stock y actívalos desde el panel admin.",
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
