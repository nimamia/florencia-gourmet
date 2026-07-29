import Link from "next/link";
import { cerrarSesion } from "@/actions/auth.actions";

export function AdminSidebar() {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-zinc-200 p-4 dark:border-zinc-800">
      <p className="mb-6 font-semibold text-rose-700">Florencia Gourmet</p>
      <nav className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <Link href="/admin" className="hover:text-rose-700">
          Dashboard
        </Link>
        <Link href="/admin/productos" className="hover:text-rose-700">
          Productos
        </Link>
        <Link href="/admin/categorias" className="hover:text-rose-700">
          Categorías
        </Link>
        <Link href="/admin/pedidos" className="hover:text-rose-700">
          Pedidos
        </Link>
      </nav>
      <form action={cerrarSesion} className="mt-8">
        <button type="submit" className="text-sm text-zinc-500 hover:text-rose-700">
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
