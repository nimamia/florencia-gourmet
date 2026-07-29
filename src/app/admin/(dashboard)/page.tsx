import { obtenerEstadisticasDashboard } from "@/actions/pedidos.actions";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await obtenerEstadisticasDashboard();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">Ventas del mes</p>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {formatPrice(stats.ventasDelMes)}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">Pedidos pendientes</p>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {stats.pedidosPendientes}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Productos más vendidos
        </h2>
        {stats.topProductos.length === 0 ? (
          <p className="text-sm text-zinc-500">Aún no hay ventas registradas.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {stats.topProductos.map((producto, index) => (
              <li key={index} className="flex justify-between">
                <span>{producto.nombre}</span>
                <span>{producto.cantidad} vendidos</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
