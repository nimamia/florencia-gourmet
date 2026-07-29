"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Buscador({ valorInicial }: { valorInicial?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(valorInicial ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (valor) {
        params.set("busqueda", valor);
      } else {
        params.delete("busqueda");
      }
      router.replace(`${pathname}?${params.toString()}`);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  return (
    <input
      type="search"
      value={valor}
      onChange={(e) => setValor(e.target.value)}
      placeholder="Buscar productos..."
      className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm focus:border-rose-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
    />
  );
}
