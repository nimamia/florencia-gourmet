import { notFound } from "next/navigation";
import { obtenerPedidoPorId } from "@/actions/pedidos.actions";
import { formatPrice } from "@/lib/utils";
import { CambiarEstadoPedido } from "@/components/admin/CambiarEstadoPedido";

export default async function AdminPedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = await obtenerPedidoPorId(id);

  if (!pedido) notFound();

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Pedido {pedido.numeroOrden}
      </h1>

      <div className="rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
        <p>
          <strong>Cliente:</strong> {pedido.clienteNombre} ({pedido.clienteEmail})
        </p>
        <p>
          <strong>Teléfono:</strong> {pedido.clienteTelefono}
        </p>
        <p>
          <strong>Dirección:</strong> {pedido.direccion}, {pedido.distrito}
        </p>
        {pedido.referencia && (
          <p>
            <strong>Referencia:</strong> {pedido.referencia}
          </p>
        )}
        {pedido.notas && (
          <p>
            <strong>Notas:</strong> {pedido.notas}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
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
        <div className="mt-3 flex flex-col gap-1 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(Number(pedido.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>{formatPrice(Number(pedido.costoEnvio))}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(Number(pedido.total))}</span>
          </div>
        </div>
      </div>

      <CambiarEstadoPedido id={pedido.id} estadoActual={pedido.estado} />
    </div>
  );
}
