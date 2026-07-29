"use client";

import Link from "next/link";
import { useCarritoStore } from "@/stores/carrito.store";
import { calcularSubtotal, calcularEnvio } from "@/lib/carrito";
import { CartItem } from "@/components/carrito/CartItem";
import { CartSummary } from "@/components/carrito/CartSummary";

export default function CarritoPage() {
  const items = useCarritoStore((state) => state.items);
  const vaciarCarrito = useCarritoStore((state) => state.vaciarCarrito);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-zinc-500">Tu carrito está vacío.</p>
        <Link
          href="/productos"
          className="rounded-md bg-rose-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  const subtotal = calcularSubtotal(items);
  const envio = calcularEnvio(items, subtotal);
  const total = subtotal + envio;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Carrito</h1>
          <button onClick={vaciarCarrito} className="text-sm text-zinc-500 hover:text-rose-700">
            Vaciar carrito
          </button>
        </div>
        {items.map((item) => (
          <CartItem key={item.productoId} item={item} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <CartSummary subtotal={subtotal} envio={envio} total={total} />
        <Link
          href="/checkout"
          className="rounded-md bg-rose-700 px-6 py-2.5 text-center text-sm font-medium text-white transition hover:bg-rose-800"
        >
          Continuar a checkout
        </Link>
      </div>
    </div>
  );
}
