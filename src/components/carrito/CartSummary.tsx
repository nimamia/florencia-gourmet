import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type CartSummaryProps = {
  subtotal: number;
  envio: number;
  total: number;
};

export function CartSummary({ subtotal, envio, total }: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Envío</span>
        <span>{envio === 0 ? "Gratis" : formatPrice(envio)}</span>
      </div>
      {envio > 0 && (
        <p className="text-xs text-zinc-500">
          Envío gratis en compras mayores a {formatPrice(siteConfig.envio.montoMinimoGratis)}
        </p>
      )}
      <div className="flex justify-between border-t border-zinc-200 pt-2 font-semibold dark:border-zinc-800">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
