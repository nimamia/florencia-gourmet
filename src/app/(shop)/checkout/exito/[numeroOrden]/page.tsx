import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerPedidoPorNumeroOrden } from "@/actions/pedidos.actions";
import { formatPrice } from "@/lib/utils";

export default async function CheckoutExitoPage({
  params,
}: {
  params: Promise<{ numeroOrden: string }>;
}) {
  const { numeroOrden } = await params;
  const pedido = await obtenerPedidoPorNumeroOrden(numeroOrden);

  if (!pedido) notFound();

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        ¡Pedido confirmado!
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Tu número de orden es <strong>{pedido.numeroOrden}</strong>. Te enviamos un correo de
        confirmación a {pedido.clienteEmail}.
      </p>
      <div className="w-full rounded-lg border border-zinc-200 p-4 text-left dark:border-zinc-800">
        <ul className="flex flex-col gap-2 text-sm">
          {pedido.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.nombreProducto} × {item.cantidad}
              </span>
              <span>{formatPrice(Number(item.subtotal))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-zinc-200 pt-3 text-right font-semibold dark:border-zinc-800">
          Total: {formatPrice(Number(pedido.total))}
        </div>
      </div>
      <Link
        href="/productos"
        className="rounded-md bg-rose-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800"
      >
        Seguir comprando
      </Link>
    </div>
  );
}
