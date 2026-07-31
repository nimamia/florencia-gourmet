"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { EstadoProducto } from "@/generated/prisma/client";
import { slugify } from "@/lib/utils";
import { subirImagenProducto, eliminarImagenProducto } from "@/lib/supabase/storage";

type ResultadoAccion = { ok: true } | { ok: false; error: string };

export async function obtenerCategorias() {
  return prisma.categoria.findMany({ orderBy: [{ orden: "asc" }, { nombre: "asc" }] });
}

export async function obtenerProductos(params: { categoria?: string; busqueda?: string }) {
  const { categoria, busqueda } = params;

  const productos = await prisma.producto.findMany({
    where: {
      estado: EstadoProducto.ACTIVO,
      ...(categoria ? { categoria: { slug: categoria } } : {}),
      ...(busqueda ? { nombre: { contains: busqueda, mode: "insensitive" } } : {}),
    },
    include: {
      categoria: true,
      imagenes: { orderBy: { orden: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return productos.map((producto) => ({
    ...producto,
    precio: Number(producto.precio),
    precioPorMayor: producto.precioPorMayor ? Number(producto.precioPorMayor) : null,
  }));
}

export async function obtenerProductoPorSlug(slug: string) {
  const producto = await prisma.producto.findUnique({
    where: { slug },
    include: {
      categoria: true,
      imagenes: { orderBy: { orden: "asc" } },
    },
  });

  if (!producto) return null;

  return {
    ...producto,
    precio: Number(producto.precio),
    precioPorMayor: producto.precioPorMayor ? Number(producto.precioPorMayor) : null,
  };
}

export async function obtenerProductosAdmin() {
  const productos = await prisma.producto.findMany({
    include: { categoria: true, imagenes: { orderBy: { orden: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return productos.map((producto) => ({
    ...producto,
    precio: Number(producto.precio),
    precioPorMayor: producto.precioPorMayor ? Number(producto.precioPorMayor) : null,
  }));
}

export async function obtenerProductoPorId(id: string) {
  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });

  if (!producto) return null;

  return {
    ...producto,
    precio: Number(producto.precio),
    precioPorMayor: producto.precioPorMayor ? Number(producto.precioPorMayor) : null,
  };
}

function leerDatosFormularioProducto(formData: FormData) {
  const precioPorMayorRaw = String(formData.get("precioPorMayor") ?? "").trim();
  const cantidadPorMayorRaw = String(formData.get("cantidadPorMayor") ?? "").trim();

  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    precio: Number(formData.get("precio")),
    stock: Number(formData.get("stock")),
    categoriaId: String(formData.get("categoriaId") ?? ""),
    precioPorMayor: precioPorMayorRaw ? Number(precioPorMayorRaw) : null,
    cantidadPorMayor: cantidadPorMayorRaw ? Number(cantidadPorMayorRaw) : null,
    imagenes: formData
      .getAll("imagenes")
      .filter((archivo): archivo is File => archivo instanceof File && archivo.size > 0),
  };
}

function validarDatosProducto(datos: {
  nombre: string;
  categoriaId: string;
  precio: number;
  stock: number;
  precioPorMayor: number | null;
  cantidadPorMayor: number | null;
}): string | null {
  if (!datos.nombre || datos.nombre.length < 3) return "Ingresa un nombre válido.";
  if (!datos.categoriaId) return "Selecciona una categoría.";
  if (!Number.isFinite(datos.precio) || datos.precio <= 0) return "Ingresa un precio válido.";
  if (!Number.isFinite(datos.stock) || datos.stock < 0) return "Ingresa un stock válido.";
  if (datos.precioPorMayor !== null && (!Number.isFinite(datos.precioPorMayor) || datos.precioPorMayor <= 0)) {
    return "Ingresa un precio por mayor válido.";
  }
  if (datos.cantidadPorMayor !== null && (!Number.isInteger(datos.cantidadPorMayor) || datos.cantidadPorMayor <= 0)) {
    return "Ingresa una cantidad por mayor válida.";
  }
  if ((datos.precioPorMayor === null) !== (datos.cantidadPorMayor === null)) {
    return "El precio por mayor y la cantidad por mayor van juntos: completa ambos o ninguno.";
  }
  return null;
}

export async function crearProducto(formData: FormData): Promise<ResultadoAccion> {
  const datos = leerDatosFormularioProducto(formData);
  const errorValidacion = validarDatosProducto(datos);
  if (errorValidacion) return { ok: false, error: errorValidacion };

  let urls: string[] = [];
  try {
    urls = await Promise.all(datos.imagenes.map((archivo) => subirImagenProducto(archivo)));
  } catch {
    return { ok: false, error: "No se pudieron subir las imágenes." };
  }

  try {
    await prisma.producto.create({
      data: {
        nombre: datos.nombre,
        slug: slugify(datos.nombre),
        descripcion: datos.descripcion,
        precio: datos.precio,
        stock: datos.stock,
        categoriaId: datos.categoriaId,
        precioPorMayor: datos.precioPorMayor,
        cantidadPorMayor: datos.cantidadPorMayor,
        imagenes: { create: urls.map((url, index) => ({ url, orden: index })) },
      },
    });
  } catch {
    return { ok: false, error: "Ya existe un producto con ese nombre." };
  }

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  return { ok: true };
}

export async function actualizarProducto(
  id: string,
  formData: FormData,
): Promise<ResultadoAccion> {
  const datos = leerDatosFormularioProducto(formData);
  const errorValidacion = validarDatosProducto(datos);
  if (errorValidacion) return { ok: false, error: errorValidacion };

  const estado = formData.get("estado") === "INACTIVO" ? "INACTIVO" : "ACTIVO";

  let urlsNuevas: string[] = [];
  try {
    urlsNuevas = await Promise.all(datos.imagenes.map((archivo) => subirImagenProducto(archivo)));
  } catch {
    return { ok: false, error: "No se pudieron subir las imágenes nuevas." };
  }

  const imagenesExistentes = await prisma.imagenProducto.count({ where: { productoId: id } });

  const actualizado = await prisma.producto.update({
    where: { id },
    data: {
      nombre: datos.nombre,
      slug: slugify(datos.nombre),
      descripcion: datos.descripcion,
      precio: datos.precio,
      stock: datos.stock,
      categoriaId: datos.categoriaId,
      precioPorMayor: datos.precioPorMayor,
      cantidadPorMayor: datos.cantidadPorMayor,
      estado,
      imagenes: {
        create: urlsNuevas.map((url, index) => ({ url, orden: imagenesExistentes + index })),
      },
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath(`/productos/${actualizado.slug}`);
  return { ok: true };
}

export async function eliminarImagenDeProducto(imagenId: string): Promise<ResultadoAccion> {
  const imagen = await prisma.imagenProducto.findUnique({ where: { id: imagenId } });
  if (!imagen) return { ok: false, error: "Imagen no encontrada." };

  await prisma.imagenProducto.delete({ where: { id: imagenId } });
  await eliminarImagenProducto(imagen.url).catch(() => {});

  revalidatePath("/admin/productos");
  return { ok: true };
}

export async function eliminarProducto(id: string): Promise<ResultadoAccion> {
  const tienePedidos = await prisma.itemPedido.count({ where: { productoId: id } });

  if (tienePedidos > 0) {
    await prisma.producto.update({ where: { id }, data: { estado: "INACTIVO" } });
  } else {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: { imagenes: true },
    });
    for (const imagen of producto?.imagenes ?? []) {
      await eliminarImagenProducto(imagen.url).catch(() => {});
    }
    await prisma.producto.delete({ where: { id } });
  }

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  return { ok: true };
}
