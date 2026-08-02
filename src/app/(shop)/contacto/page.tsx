import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function ContactoPage() {
  const whatsappHref = `https://wa.me/${siteConfig.contacto.whatsapp}?text=Hola%20Florencia%20Gourmet%2C%20quisiera%20hacer%20un%20pedido`;
  const instagramHref = `https://instagram.com/${siteConfig.contacto.instagram}`;

  return (
    <div className="-mx-4 bg-[#fdf1e4] px-4 py-16 dark:bg-zinc-900">
      <div className="mx-auto grid max-w-5xl items-center gap-12 sm:grid-cols-[1fr_0.8fr]">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold tracking-widest text-orange-500 uppercase">
            Hablemos
          </p>
          <h1
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl font-medium italic text-zinc-900 sm:text-5xl dark:text-zinc-100"
          >
            Haz tu pedido hoy mismo
          </h1>
          <p className="max-w-md text-zinc-600 dark:text-zinc-400">
            Escríbenos por WhatsApp contándonos la ocasión, y te ayudamos a armar el arreglo o
            bandeja perfecta.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#1fb955] hover:-translate-y-0.5"
            >
              <span>💬</span> {siteConfig.contacto.whatsappDisplay}
            </a>
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border-[1.5px] border-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white dark:border-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-200 dark:hover:text-zinc-900"
            >
              <span>📷</span> @{siteConfig.contacto.instagram}
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="/images/tarjeta-contacto.webp"
            alt="Escanea el código QR para seguir a Florencia Gourmet en Instagram"
            width={800}
            height={520}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
