import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CarritoBadge } from "@/components/layout/CarritoBadge";

export function Header() {
  const whatsappHref = `https://wa.me/${siteConfig.contacto.whatsapp}`;

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-[#fffaf0]/95 backdrop-blur dark:border-zinc-800 dark:bg-black/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span
            style={{ fontFamily: "var(--font-script)" }}
            className="text-2xl text-zinc-900 dark:text-zinc-100"
          >
            Florencia
          </span>
          <span className="text-sm font-semibold tracking-widest text-orange-500 uppercase">
            Gourmet
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <Link href="/" className="hover:text-orange-500">
            Inicio
          </Link>
          <Link href="/productos?categoria=flores-importadas" className="hover:text-orange-500">
            Flores
          </Link>
          <Link href="/productos?categoria=dulces-y-salados" className="hover:text-orange-500">
            Dulces &amp; Salados
          </Link>
          <Link href="/nosotros" className="hover:text-orange-500">
            Nosotros
          </Link>
          <Link href="/contacto" className="hover:text-orange-500">
            Contacto
          </Link>
          <Link href="/carrito" className="flex items-center hover:text-orange-500">
            Carrito
            <CarritoBadge />
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
          >
            Pedir ahora
          </a>
        </nav>
      </div>
    </header>
  );
}
