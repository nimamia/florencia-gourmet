"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { eliminarProducto } from "@/actions/productos.actions";

export function EliminarProductoBoton({ id }: { id: string }) {
  const router = useRouter();
  const [eliminando, setEliminando] = useState(false);

  async function handleClick() {
    setEliminando(true);
    await eliminarProducto(id);
    setEliminando(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={eliminando}
      className="text-rose-700 hover:text-rose-800 disabled:opacity-60"
    >
      Eliminar
    </button>
  );
}
