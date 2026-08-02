import Image from "next/image";

const BULLETS = [
  "Pedidos personalizados",
  "Atención por WhatsApp",
  "Coordinación de entrega en Lima",
];

export default function NosotrosPage() {
  return (
    <div className="-mx-4 px-4 py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-12 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 flex flex-col gap-4 sm:order-1">
          <p className="text-sm font-semibold tracking-widest text-orange-500 uppercase">
            Nuestra historia
          </p>
          <h1
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl font-medium italic text-zinc-900 sm:text-5xl dark:text-zinc-100"
          >
            Hecho con cariño, pensado para ti
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            En Florencia Gourmet combinamos la frescura de las flores con el sabor casero de
            nuestros dulces y salados. Cada pedido se prepara con dedicación para que puedas
            sorprender, agradecer o simplemente darte un gusto.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Trabajamos con pedidos personalizados para cumpleaños, aniversarios, eventos
            corporativos y toda ocasión que merezca un detalle especial.
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                <span className="text-orange-500">✔</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 overflow-hidden rounded-2xl shadow-xl sm:order-2">
          <Image
            src="/images/tarjeta-nosotros.webp"
            alt="Catálogo Florencia Gourmet: flores, dulces y salados"
            width={800}
            height={520}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
