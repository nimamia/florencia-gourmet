"use client";

import { useState } from "react";
import { crearCategoria, actualizarCategoria } from "@/actions/categorias.actions";

type CategoriaFormProps = {
  categoria?: { id: string; nombre: string; descripcion: string | null };
  onDone?: () => void;
};

export function CategoriaForm({ categoria, onDone }: CategoriaFormProps) {
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? "");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    const resultado = categoria
      ? await actualizarCategoria(categoria.id, nombre, descripcion)
      : await crearCategoria(nombre, descripcion);

    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    if (!categoria) {
      setNombre("");
      setDescripcion("");
    }
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoría"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div className="flex-1">
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción (opcional)"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <button
        type="submit"
        disabled={enviando}
        className="rounded-md bg-rose-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-800 disabled:opacity-60"
      >
        {categoria ? "Guardar" : "Agregar"}
      </button>
      {error && <p className="text-sm text-rose-700 sm:basis-full">{error}</p>}
    </form>
  );
}
