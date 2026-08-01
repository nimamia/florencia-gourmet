import { siteConfig } from "@/config/site";

export default function ContactoPage() {
  const whatsappHref = `https://wa.me/${siteConfig.contacto.whatsapp}`;
  const instagramHref = `https://instagram.com/${siteConfig.contacto.instagram}`;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-8">
      <p className="text-sm font-medium tracking-wide text-rose-700 uppercase">Hablemos</p>
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
        Haz tu pedido hoy mismo
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Escríbenos por WhatsApp contándonos la ocasión, y te ayudamos a armar el arreglo o
        bandeja perfecta.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700"
        >
          {siteConfig.contacto.whatsappDisplay}
        </a>
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-rose-700 hover:text-rose-700 dark:border-zinc-700 dark:text-zinc-300"
        >
          @{siteConfig.contacto.instagram}
        </a>
      </div>
      <p className="text-sm text-zinc-500">{siteConfig.contacto.ubicacion}</p>
    </div>
  );
}
