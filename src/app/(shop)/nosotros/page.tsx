import { siteConfig } from "@/config/site";

const BULLETS = [
  "Pedidos personalizados",
  "Atención por WhatsApp",
  "Coordinación de entrega en Lima",
];

export default function NosotrosPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-8">
      <p className="text-sm font-medium tracking-wide text-rose-700 uppercase">Nuestra historia</p>
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
        Flores frescas y bocaditos caseros, hechos con cariño
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        En {siteConfig.nombre} combinamos flores importadas con bocaditos dulces y salados
        caseros para armar pedidos personalizados para cumpleaños, aniversarios y eventos
        corporativos en {siteConfig.contacto.ubicacion}.
      </p>
      <ul className="flex flex-col gap-2">
        {BULLETS.map((bullet) => (
          <li key={bullet} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <span className="text-rose-700">✓</span>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
