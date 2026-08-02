import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="-mx-4 flex flex-col items-center gap-4 bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 px-4 py-16 text-center dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900">
        <p className="text-sm font-semibold tracking-widest text-orange-500 uppercase">
          Flores &amp; Gourmet en Lima
        </p>
        <h1
          style={{ fontFamily: "var(--font-script)" }}
          className="text-5xl text-zinc-900 sm:text-6xl dark:text-zinc-100"
        >
          Florencia <span className="text-orange-500">Gourmet</span>
        </h1>
        <p className="max-w-xl text-zinc-600 dark:text-zinc-400">{siteConfig.descripcion}</p>
        <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
          Ramos que enamoran y bocaditos que se disfrutan. Todo en un solo lugar, hecho con
          cariño para tus momentos más especiales.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/productos?categoria=flores-importadas"
            className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Ver flores
          </Link>
          <Link
            href="/productos?categoria=dulces-y-salados"
            className="rounded-full border border-zinc-300 bg-white/60 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-orange-500 hover:text-orange-500 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-200"
          >
            Ver dulces y salados
          </Link>
        </div>
      </section>
    </div>
  );
}
