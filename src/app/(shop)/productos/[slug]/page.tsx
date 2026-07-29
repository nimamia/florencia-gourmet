import Image from "next/image";
import { notFound } from "next/navigation";
import { obtenerProductoPorSlug } from "@/actions/productos.actions";
import { formatPrice } from "@/lib/utils";
import { AgregarAlCarritoButton } from "@/components/carrito/AgregarAlCarritoButton";

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);

  if (!producto) notFound();

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {producto.imagenes[0] ? (
            <Image
              src={producto.imagenes[0].url}
              alt={producto.imagenes[0].altText ?? producto.nombre}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              Sin imagen
            </div>
          )}
        </div>
        {producto.imagenes.length > 1 && (
          <div className="flex gap-2">
            {producto.imagenes.map((imagen) => (
              <div
                key={imagen.id}
                className="relative h-16 w-16 overflow-hidden rounded border border-zinc-200 dark:border-zinc-700"
              >
                <Image
                  src={imagen.url}
                  alt={imagen.altText ?? producto.nombre}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm text-rose-700">{producto.categoria.nombre}</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {producto.nombre}
        </h1>
        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {formatPrice(producto.precio)}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400">{producto.descripcion}</p>
        <p className="text-sm text-zinc-500">
          {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
        </p>
        <div>
          <AgregarAlCarritoButton
            productoId={producto.id}
            slug={producto.slug}
            nombre={producto.nombre}
            precio={producto.precio}
            stock={producto.stock}
            imagenUrl={producto.imagenes[0]?.url}
          />
        </div>
      </div>
    </div>
  );
}
