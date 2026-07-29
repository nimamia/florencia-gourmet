"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCarritoStore, type ItemCarrito } from "@/stores/carrito.store";

export function CartItem({ item }: { item: ItemCarrito }) {
  const actualizarCantidad = useCarritoStore((state) => state.actualizarCantidad);
  const quitarItem = useCarritoStore((state) => state.quitarItem);

  return (
    <div className="flex items-center gap-4 border-b border-zinc-200 py-4 dark:border-zinc-800">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
        {item.imagenUrl && (
          <Image src={item.imagenUrl} alt={item.nombre} fill sizes="80px" className="object-cover" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.nombre}</p>
        <p className="text-sm text-zinc-500">{formatPrice(item.precio)} c/u</p>
        {item.cantidad >= item.stock && (
          <p className="text-xs text-amber-600">Máximo disponible: {item.stock}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)}
          disabled={item.cantidad <= 1}
          className="h-7 w-7 rounded border border-zinc-300 text-sm disabled:opacity-40 dark:border-zinc-700"
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{item.cantidad}</span>
        <button
          onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
          disabled={item.cantidad >= item.stock}
          className="h-7 w-7 rounded border border-zinc-300 text-sm disabled:opacity-40 dark:border-zinc-700"
        >
          +
        </button>
      </div>
      <p className="w-24 text-right font-medium text-zinc-900 dark:text-zinc-100">
        {formatPrice(item.precio * item.cantidad)}
      </p>
      <button
        onClick={() => quitarItem(item.productoId)}
        aria-label="Quitar del carrito"
        className="text-zinc-400 hover:text-rose-700"
      >
        ✕
      </button>
    </div>
  );
}
