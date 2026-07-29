"use client";

import { useState } from "react";
import { eliminarCategoria } from "@/actions/categorias.actions";
import { CategoriaForm } from "@/components/admin/CategoriaForm";

type CategoriaRowProps = {
  categoria: {
    id: string;
    nombre: string;
    descripcion: string | null;
    _count: { productos: number };
  };
};

export function CategoriaRow({ categoria }: CategoriaRowProps) {
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState(false);

  if (editando) {
    return (
      <div className="border-b border-zinc-200 py-3 dark:border-zinc-800">
        <CategoriaForm categoria={categoria} onDone={() => setEditando(false)} />
      </div>
    );
  }

  async function handleEliminar() {
    setError(null);
    setEliminando(true);
    const resultado = await eliminarCategoria(categoria.id);
    setEliminando(false);
    if (!resultado.ok) {
      setError(resultado.error);
    }
  }

  return (
    <div className="flex flex-col gap-1 border-b border-zinc-200 py-3 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{categoria.nombre}</p>
          {categoria.descripcion && (
            <p className="text-sm text-zinc-500">{categoria.descripcion}</p>
          )}
          <p className="text-xs text-zinc-400">{categoria._count.productos} producto(s)</p>
        </div>
        <div className="flex gap-3 text-sm">
          <button onClick={() => setEditando(true)} className="text-zinc-600 hover:text-rose-700">
            Editar
          </button>
          <button
            onClick={handleEliminar}
            disabled={eliminando}
            className="text-rose-700 hover:text-rose-800 disabled:opacity-60"
          >
            Eliminar
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-rose-700">{error}</p>}
    </div>
  );
}
