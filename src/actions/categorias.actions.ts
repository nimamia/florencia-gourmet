"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type ResultadoAccion = { ok: true } | { ok: false; error: string };

export async function obtenerCategoriasAdmin() {
  return prisma.categoria.findMany({
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    include: { _count: { select: { productos: true } } },
  });
}

export async function crearCategoria(
  nombre: string,
  descripcion?: string,
  orden?: number,
): Promise<ResultadoAccion> {
  if (!nombre || nombre.trim().length < 2) {
    return { ok: false, error: "Ingresa un nombre válido." };
  }

  try {
    await prisma.categoria.create({
      data: { nombre: nombre.trim(), slug: slugify(nombre), descripcion, orden: orden ?? 0 },
    });
  } catch {
    return { ok: false, error: "Ya existe una categoría con ese nombre." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/productos");
  revalidatePath("/");
  return { ok: true };
}

export async function actualizarCategoria(
  id: string,
  nombre: string,
  descripcion?: string,
  orden?: number,
): Promise<ResultadoAccion> {
  if (!nombre || nombre.trim().length < 2) {
    return { ok: false, error: "Ingresa un nombre válido." };
  }

  try {
    await prisma.categoria.update({
      where: { id },
      data: { nombre: nombre.trim(), descripcion, orden: orden ?? 0 },
    });
  } catch {
    return { ok: false, error: "No se pudo actualizar la categoría." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/productos");
  revalidatePath("/");
  return { ok: true };
}

export async function eliminarCategoria(id: string): Promise<ResultadoAccion> {
  const productosAsociados = await prisma.producto.count({ where: { categoriaId: id } });
  if (productosAsociados > 0) {
    return {
      ok: false,
      error: `No se puede eliminar: hay ${productosAsociados} producto(s) en esta categoría.`,
    };
  }

  await prisma.categoria.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidatePath("/productos");
  return { ok: true };
}
