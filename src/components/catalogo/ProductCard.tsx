import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  slug: string;
  nombre: string;
  precio: number;
  imagenUrl?: string;
  stock: number;
};

export function ProductCard({ slug, nombre, precio, imagenUrl, stock }: ProductCardProps) {
  return (
    <Link
      href={`/productos/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Sin imagen
          </div>
        )}
        {stock === 0 && (
          <span className="absolute top-2 left-2 rounded bg-zinc-900/80 px-2 py-1 text-xs text-white">
            Agotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {nombre}
        </h3>
        <p className="mt-auto text-base font-semibold text-rose-700 dark:text-rose-400">
          {formatPrice(precio)}
        </p>
      </div>
    </Link>
  );
}
