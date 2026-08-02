import Link from "next/link";

type FiltroCategoriaProps = {
  categorias: { slug: string; nombre: string }[];
  categoriaActiva?: string;
  busqueda?: string;
};

function construirHref(categoriaSlug: string | undefined, busqueda: string | undefined) {
  const params = new URLSearchParams();
  if (categoriaSlug) params.set("categoria", categoriaSlug);
  if (busqueda) params.set("busqueda", busqueda);
  const query = params.toString();
  return query ? `/productos?${query}` : "/productos";
}

export function FiltroCategoria({ categorias, categoriaActiva, busqueda }: FiltroCategoriaProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categorias.map((categoria) => (
        <Link
          key={categoria.slug}
          href={construirHref(categoria.slug, busqueda)}
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            categoriaActiva === categoria.slug
              ? "border-rose-700 bg-rose-700 text-white"
              : "border-zinc-300 text-zinc-700 hover:border-rose-700 hover:text-rose-700 dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          {categoria.nombre}
        </Link>
      ))}
    </div>
  );
}
