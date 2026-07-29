import { obtenerCategorias, obtenerProductos } from "@/actions/productos.actions";
import { ProductCard } from "@/components/catalogo/ProductCard";
import { FiltroCategoria } from "@/components/catalogo/FiltroCategoria";
import { Buscador } from "@/components/catalogo/Buscador";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busqueda?: string }>;
}) {
  const { categoria, busqueda } = await searchParams;

  const [categorias, productos] = await Promise.all([
    obtenerCategorias(),
    obtenerProductos({ categoria, busqueda }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FiltroCategoria categorias={categorias} categoriaActiva={categoria} busqueda={busqueda} />
        <div className="sm:w-72">
          <Buscador valorInicial={busqueda} />
        </div>
      </div>

      {productos.length === 0 ? (
        <p className="py-12 text-center text-zinc-500">
          No se encontraron productos con esos criterios.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((producto) => (
            <ProductCard
              key={producto.id}
              slug={producto.slug}
              nombre={producto.nombre}
              precio={producto.precio}
              imagenUrl={producto.imagenes[0]?.url}
              stock={producto.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
