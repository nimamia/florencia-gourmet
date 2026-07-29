"use client";

import { useState } from "react";
import { useCarritoStore } from "@/stores/carrito.store";

type AgregarAlCarritoButtonProps = {
  productoId: string;
  slug: string;
  nombre: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
};

export function AgregarAlCarritoButton(props: AgregarAlCarritoButtonProps) {
  const agregarItem = useCarritoStore((state) => state.agregarItem);
  const [agregado, setAgregado] = useState(false);

  if (props.stock === 0) {
    return (
      <button
        disabled
        className="rounded-md bg-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-500 dark:bg-zinc-800"
      >
        Agotado
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        agregarItem(props);
        setAgregado(true);
        setTimeout(() => setAgregado(false), 1500);
      }}
      className="rounded-md bg-rose-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800"
    >
      {agregado ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  );
}
