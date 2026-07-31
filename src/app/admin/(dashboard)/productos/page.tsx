import Link from "next/link";
import { obtenerProductosAdmin } from "@/actions/productos.actions";
import { formatPrice } from "@/lib/utils";
import { EliminarProductoBoton } from "@/components/admin/EliminarProductoBoton";

export default async function AdminProductosPage() {
  const productos = await obtenerProductosAdmin();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-md bg-rose-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-800"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
              <th className="py-2 pr-4">Nombre</th>
              <th className="pr-4">Categoría</th>
              <th className="pr-4">Precio</th>
              <th className="pr-4">Stock</th>
              <th className="pr-4">Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4">{producto.nombre}</td>
                <td className="pr-4">{producto.categoria.nombre}</td>
                <td className="pr-4">
                  {formatPrice(producto.precio)}
                  {producto.precioPorMayor && producto.cantidadPorMayor && (
                    <div className="text-xs text-zinc-500">
                      Mayor ({producto.cantidadPorMayor}u): {formatPrice(producto.precioPorMayor)}
                    </div>
                  )}
                </td>
                <td className="pr-4">{producto.stock}</td>
                <td className="pr-4">{producto.estado === "ACTIVO" ? "Activo" : "Inactivo"}</td>
                <td className="flex gap-3 py-2">
                  <Link
                    href={`/admin/productos/${producto.id}/editar`}
                    className="text-zinc-600 hover:text-rose-700 dark:text-zinc-400"
                  >
                    Editar
                  </Link>
                  <EliminarProductoBoton id={producto.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
