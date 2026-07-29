"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCarritoStore, useCarritoHidratado } from "@/stores/carrito.store";
import { calcularSubtotal, calcularEnvio } from "@/lib/carrito";
import { FormularioEnvio } from "@/components/checkout/FormularioEnvio";
import { ResumenPedido } from "@/components/checkout/ResumenPedido";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCarritoStore((state) => state.items);
  const hidratado = useCarritoHidratado();

  useEffect(() => {
    if (hidratado && items.length === 0) {
      router.replace("/carrito");
    }
  }, [hidratado, items.length, router]);

  if (!hidratado || items.length === 0) {
    return null;
  }

  const subtotal = calcularSubtotal(items);
  const envio = calcularEnvio(items, subtotal);
  const total = subtotal + envio;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Datos de envío
        </h1>
        <FormularioEnvio />
      </div>
      <div>
        <ResumenPedido items={items} subtotal={subtotal} envio={envio} total={total} />
      </div>
    </div>
  );
}
