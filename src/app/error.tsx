"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Algo salió mal</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Ocurrió un error inesperado. Intenta de nuevo o vuelve más tarde.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-rose-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800"
      >
        Reintentar
      </button>
    </div>
  );
}
