"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ItemCarrito = {
  productoId: string;
  slug: string;
  nombre: string;
  precio: number;
  cantidad: number;
  stock: number;
  imagenUrl?: string;
};

type CarritoState = {
  items: ItemCarrito[];
  agregarItem: (item: Omit<ItemCarrito, "cantidad">, cantidad?: number) => void;
  quitarItem: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  vaciarCarrito: () => void;
};

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set) => ({
      items: [],
      agregarItem: (item, cantidad = 1) =>
        set((state) => {
          const existente = state.items.find((i) => i.productoId === item.productoId);
          if (existente) {
            const nuevaCantidad = Math.min(existente.cantidad + cantidad, item.stock);
            return {
              items: state.items.map((i) =>
                i.productoId === item.productoId
                  ? { ...i, cantidad: nuevaCantidad, stock: item.stock }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, cantidad: Math.min(cantidad, item.stock) }],
          };
        }),
      quitarItem: (productoId) =>
        set((state) => ({ items: state.items.filter((i) => i.productoId !== productoId) })),
      actualizarCantidad: (productoId, cantidad) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productoId === productoId
              ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) }
              : i,
          ),
        })),
      vaciarCarrito: () => set({ items: [] }),
    }),
    { name: "florencia-gourmet-carrito" },
  ),
);

/**
 * El middleware `persist` rehidrata desde localStorage de forma asíncrona.
 * Este hook evita leer `items` como "vacío" antes de que termine ese proceso
 * (crítico para decisiones como redirigir fuera de /checkout).
 */
export function useCarritoHidratado(): boolean {
  // Arranca en `false` tanto en servidor como en cliente (mismo valor en ambos
  // renders) para evitar un mismatch de hidratación; solo se verifica el
  // estado real dentro de useEffect, que nunca corre en el servidor.
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    setHidratado(useCarritoStore.persist.hasHydrated());
    return useCarritoStore.persist.onFinishHydration(() => setHidratado(true));
  }, []);

  return hidratado;
}
