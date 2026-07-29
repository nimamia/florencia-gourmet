import { notFound } from "next/navigation";
import { obtenerCategorias, obtenerProductoPorId } from "@/actions/productos.actions";
import { ProductoForm } from "@/components/admin/ProductoForm";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categorias, producto] = await Promise.all([
    obtenerCategorias(),
    obtenerProductoPorId(id),
  ]);

  if (!producto) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Editar producto</h1>
      <ProductoForm categorias={categorias} producto={producto} />
    </div>
  );
}
