"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  crearProducto,
  actualizarProducto,
  eliminarImagenDeProducto,
} from "@/actions/productos.actions";

type Categoria = { id: string; nombre: string };
type ImagenExistente = { id: string; url: string };

type ProductoFormProps = {
  categorias: Categoria[];
  producto?: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    precioPorMayor: number | null;
    cantidadPorMayor: number | null;
    stock: number;
    categoriaId: string;
    estado: string;
    imagenes: ImagenExistente[];
  };
};

export function ProductoForm({ categorias, producto }: ProductoFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [imagenesExistentes, setImagenesExistentes] = useState(producto?.imagenes ?? []);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setEnviando(true);

    const resultado = producto
      ? await actualizarProducto(producto.id, formData)
      : await crearProducto(formData);

    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    router.push("/admin/productos");
  }

  async function handleEliminarImagen(imagenId: string) {
    await eliminarImagenDeProducto(imagenId);
    setImagenesExistentes((prev) => prev.filter((imagen) => imagen.id !== imagenId));
  }

  return (
    <form action={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre</label>
        <input
          name="nombre"
          defaultValue={producto?.nombre}
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Descripción
        </label>
        <textarea
          name="descripcion"
          defaultValue={producto?.descripcion}
          required
          rows={3}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Precio (S/)
          </label>
          <input
            name="precio"
            type="number"
            step="0.01"
            min="0"
            defaultValue={producto?.precio}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={producto?.stock}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Precio por mayor (S/)
          </label>
          <input
            name="precioPorMayor"
            type="number"
            step="0.01"
            min="0"
            defaultValue={producto?.precioPorMayor ?? ""}
            placeholder="Opcional"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Cantidad por mayor
          </label>
          <input
            name="cantidadPorMayor"
            type="number"
            min="1"
            step="1"
            defaultValue={producto?.cantidadPorMayor ?? ""}
            placeholder="Opcional, ej. 100"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>
      <p className="-mt-2 text-xs text-zinc-500">
        Completa ambos campos solo si el producto tiene un precio especial al comprar por mayor
        (ej. S/160 por el ciento de 100 unidades). Déjalos vacíos si no aplica.
      </p>

      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Categoría</label>
        <select
          name="categoriaId"
          defaultValue={producto?.categoriaId ?? ""}
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Selecciona...</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {producto && (
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Estado</label>
          <select
            name="estado"
            defaultValue={producto.estado}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
      )}

      {imagenesExistentes.length > 0 && (
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Imágenes actuales
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {imagenesExistentes.map((imagen) => (
              <div
                key={imagen.id}
                className="relative h-20 w-20 overflow-hidden rounded border border-zinc-200 dark:border-zinc-700"
              >
                <Image src={imagen.url} alt="" fill sizes="80px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleEliminarImagen(imagen.id)}
                  className="absolute top-0 right-0 rounded-bl bg-black/60 px-1 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {producto ? "Agregar imágenes" : "Imágenes"}
        </label>
        <input name="imagenes" type="file" accept="image/*" multiple className="mt-1 w-full text-sm" />
      </div>

      {error && <p className="text-sm text-rose-700">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-md bg-rose-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800 disabled:opacity-60"
      >
        {enviando ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
