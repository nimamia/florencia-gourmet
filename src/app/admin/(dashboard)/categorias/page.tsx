import { obtenerCategoriasAdmin } from "@/actions/categorias.actions";
import { CategoriaForm } from "@/components/admin/CategoriaForm";
import { CategoriaRow } from "@/components/admin/CategoriaRow";

export default async function AdminCategoriasPage() {
  const categorias = await obtenerCategoriasAdmin();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Categorías</h1>

      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Nueva categoría
        </h2>
        <CategoriaForm />
      </div>

      <div>
        {categorias.map((categoria) => (
          <CategoriaRow key={categoria.id} categoria={categoria} />
        ))}
      </div>
    </div>
  );
}
