import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CarritoBadge } from "@/components/layout/CarritoBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-black/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-rose-700">
          {siteConfig.nombre}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-rose-700">
            Inicio
          </Link>
          <Link href="/productos?categoria=flores-importadas" className="hover:text-rose-700">
            Flores
          </Link>
          <Link href="/productos" className="hover:text-rose-700">
            Dulces &amp; Salados
          </Link>
          <Link href="/nosotros" className="hover:text-rose-700">
            Nosotros
          </Link>
          <Link href="/contacto" className="hover:text-rose-700">
            Contacto
          </Link>
          <Link href="/carrito" className="flex items-center hover:text-rose-700">
            Carrito
            <CarritoBadge />
          </Link>
        </nav>
      </div>
    </header>
  );
}
