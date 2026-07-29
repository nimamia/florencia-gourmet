import { obtenerCategorias } from "@/actions/productos.actions";
import { ProductoForm } from "@/components/admin/ProductoForm";

export default async function NuevoProductoPage() {
  const categorias = await obtenerCategorias();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Nuevo producto</h1>
      <ProductoForm categorias={categorias} />
    </div>
  );
}
