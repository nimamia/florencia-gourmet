import Link from "next/link";
import { obtenerCategorias, obtenerProductos } from "@/actions/productos.actions";
import { ProductCard } from "@/components/catalogo/ProductCard";
import { siteConfig } from "@/config/site";

export default async function Home() {
  const [categorias, productos] = await Promise.all([
    obtenerCategorias(),
    obtenerProductos({}),
  ]);

  const destacados = productos.slice(0, 4);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-4 py-8 text-center">
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-zinc-100">
          {siteConfig.nombre}
        </h1>
        <p className="max-w-xl text-zinc-600 dark:text-zinc-400">{siteConfig.descripcion}</p>
        <Link
          href="/productos"
          className="rounded-md bg-rose-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800"
        >
          Ver catálogo
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Categorías</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categorias.map((categoria) => (
            <Link
              key={categoria.slug}
              href={`/productos?categoria=${categoria.slug}`}
              className="rounded-lg border border-zinc-200 p-6 text-center font-medium text-zinc-800 transition hover:border-rose-700 hover:text-rose-700 dark:border-zinc-800 dark:text-zinc-200"
            >
              {categoria.nombre}
            </Link>
          ))}
        </div>
      </section>

      {destacados.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Novedades</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {destacados.map((producto) => (
              <ProductCard
                key={producto.id}
                slug={producto.slug}
                nombre={producto.nombre}
                precio={producto.precio}
                precioPorMayor={producto.precioPorMayor}
                cantidadPorMayor={producto.cantidadPorMayor}
                imagenUrl={producto.imagenes[0]?.url}
                stock={producto.stock}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
