import Link from "next/link";
import { obtenerPedidosAdmin } from "@/actions/pedidos.actions";
import { formatPrice } from "@/lib/utils";

const ESTADOS = ["PENDIENTE", "PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"] as const;

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const pedidos = await obtenerPedidosAdmin({ estado });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Pedidos</h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`rounded-full border px-3 py-1 text-sm ${
            !estado
              ? "border-rose-700 bg-rose-700 text-white"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          Todos
        </Link>
        {ESTADOS.map((e) => (
          <Link
            key={e}
            href={`/admin/pedidos?estado=${e}`}
            className={`rounded-full border px-3 py-1 text-sm ${
              estado === e
                ? "border-rose-700 bg-rose-700 text-white"
                : "border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {e}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
              <th className="py-2 pr-4">N° Orden</th>
              <th className="pr-4">Cliente</th>
              <th className="pr-4">Total</th>
              <th className="pr-4">Estado</th>
              <th className="pr-4">Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4">{pedido.numeroOrden}</td>
                <td className="pr-4">{pedido.clienteNombre}</td>
                <td className="pr-4">{formatPrice(Number(pedido.total))}</td>
                <td className="pr-4">{pedido.estado}</td>
                <td className="pr-4">{pedido.createdAt.toLocaleDateString("es-PE")}</td>
                <td className="py-2">
                  <Link
                    href={`/admin/pedidos/${pedido.id}`}
                    className="text-zinc-600 hover:text-rose-700 dark:text-zinc-400"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
