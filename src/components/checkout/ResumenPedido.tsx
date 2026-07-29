import { formatPrice } from "@/lib/utils";
import { CartSummary } from "@/components/carrito/CartSummary";
import type { ItemCarrito } from "@/stores/carrito.store";

type ResumenPedidoProps = {
  items: ItemCarrito[];
  subtotal: number;
  envio: number;
  total: number;
};

export function ResumenPedido({ items, subtotal, envio, total }: ResumenPedidoProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tu pedido</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((item) => (
            <li key={item.productoId} className="flex justify-between">
              <span>
                {item.nombre} × {item.cantidad}
              </span>
              <span>{formatPrice(item.precio * item.cantidad)}</span>
            </li>
          ))}
        </ul>
      </div>
      <CartSummary subtotal={subtotal} envio={envio} total={total} />
    </div>
  );
}
