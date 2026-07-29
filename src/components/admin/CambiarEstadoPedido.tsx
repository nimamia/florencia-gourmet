"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cambiarEstadoPedido } from "@/actions/pedidos.actions";
import type { EstadoPedido } from "@/generated/prisma/client";

const ESTADOS: EstadoPedido[] = ["PENDIENTE", "PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"];

export function CambiarEstadoPedido({
  id,
  estadoActual,
}: {
  id: string;
  estadoActual: EstadoPedido;
}) {
  const router = useRouter();
  const [estado, setEstado] = useState<EstadoPedido>(estadoActual);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(nuevoEstado: EstadoPedido) {
    setEstado(nuevoEstado);
    setGuardando(true);
    setError(null);

    const resultado = await cambiarEstadoPedido(id, nuevoEstado);
    setGuardando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Estado:</label>
      <select
        value={estado}
        disabled={guardando}
        onChange={(e) => handleChange(e.target.value as EstadoPedido)}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {ESTADOS.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-rose-700">{error}</p>}
    </div>
  );
}
