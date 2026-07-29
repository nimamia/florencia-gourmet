"use client";

import { useCarritoStore } from "@/stores/carrito.store";

export function CarritoBadge() {
  const cantidad = useCarritoStore((state) =>
    state.items.reduce((acc, item) => acc + item.cantidad, 0),
  );

  if (cantidad === 0) return null;

  return (
    <span className="ml-1 rounded-full bg-rose-700 px-1.5 py-0.5 text-xs text-white">
      {cantidad}
    </span>
  );
}
