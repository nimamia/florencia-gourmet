"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
import { checkoutSchema, type CheckoutFormValues } from "@/schemas/checkout.schema";
import { useCarritoStore } from "@/stores/carrito.store";
import { calcularSubtotal, calcularEnvio } from "@/lib/carrito";
import { crearPedido } from "@/actions/pedidos.actions";

export function FormularioEnvio() {
  const router = useRouter();
  const items = useCarritoStore((state) => state.items);
  const vaciarCarrito = useCarritoStore((state) => state.vaciarCarrito);
  const [enviando, setEnviando] = useState(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = calcularSubtotal(items);
  const envio = calcularEnvio(items, subtotal);
  const total = subtotal + envio;

  function procesarPago(datos: CheckoutFormValues) {
    setErrorPago(null);

    if (!window.CulqiCheckout) {
      setErrorPago("La pasarela de pago no cargó correctamente. Recarga la página.");
      return;
    }
    if (!process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY) {
      setErrorPago("La pasarela de pago no está configurada todavía.");
      return;
    }

    const config = {
      settings: {
        title: "Florencia Gourmet",
        currency: "PEN",
        amount: Math.round(total * 100),
      },
      client: { email: datos.clienteEmail },
      options: {
        lang: "auto",
        installments: false,
        modal: true,
        paymentMethods: { tarjeta: true, yape: true },
      },
    };

    const culqi = new window.CulqiCheckout(
      process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY!,
      config,
    );

    culqi.culqi = async () => {
      if (culqi.token) {
        setEnviando(true);
        const resultado = await crearPedido(datos, items, culqi.token.id);
        if (resultado.ok) {
          vaciarCarrito();
          router.push(`/checkout/exito/${resultado.numeroOrden}`);
        } else {
          setErrorPago(resultado.error);
          setEnviando(false);
        }
      } else {
        setErrorPago(
          culqi.error?.user_message ?? "El pago fue rechazado. Intenta con otra tarjeta o método.",
        );
      }
    };

    culqi.open();
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Script src="https://js.culqi.com/checkout-js" strategy="afterInteractive" />
      <form onSubmit={handleSubmit(procesarPago)} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nombre completo
          </label>
          <input
            {...register("clienteNombre")}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          {errors.clienteNombre && (
            <p className="mt-1 text-xs text-rose-700">{errors.clienteNombre.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Correo electrónico
          </label>
          <input
            type="email"
            {...register("clienteEmail")}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          {errors.clienteEmail && (
            <p className="mt-1 text-xs text-rose-700">{errors.clienteEmail.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Teléfono</label>
          <input
            {...register("clienteTelefono")}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          {errors.clienteTelefono && (
            <p className="mt-1 text-xs text-rose-700">{errors.clienteTelefono.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Dirección
          </label>
          <input
            {...register("direccion")}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          {errors.direccion && (
            <p className="mt-1 text-xs text-rose-700">{errors.direccion.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Distrito
          </label>
          <input
            {...register("distrito")}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          {errors.distrito && (
            <p className="mt-1 text-xs text-rose-700">{errors.distrito.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Referencia (opcional)
          </label>
          <input
            {...register("referencia")}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        {errorPago && <p className="text-sm text-rose-700">{errorPago}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-rose-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800 disabled:opacity-60"
        >
          {enviando ? "Procesando..." : "Pagar"}
        </button>
      </form>
    </>
  );
}
