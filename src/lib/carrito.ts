import { siteConfig } from "@/config/site";
import type { ItemCarrito } from "@/stores/carrito.store";

export function calcularSubtotal(items: ItemCarrito[]): number {
  return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

export function calcularEnvio(items: ItemCarrito[], subtotal: number): number {
  if (items.length === 0) return 0;
  return subtotal >= siteConfig.envio.montoMinimoGratis ? 0 : siteConfig.envio.costoFijo;
}
