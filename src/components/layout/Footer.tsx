import { siteConfig } from "@/config/site";

export function Footer() {
  const whatsappHref = `https://wa.me/${siteConfig.contacto.whatsapp}`;
  const instagramHref = `https://instagram.com/${siteConfig.contacto.instagram}`;

  return (
    <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
      <p>
        {siteConfig.descripcion} · {siteConfig.contacto.ubicacion}
      </p>
      <div className="mt-2 flex justify-center gap-4">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-rose-700">
          WhatsApp
        </a>
        <a href={instagramHref} target="_blank" rel="noopener noreferrer" className="hover:text-rose-700">
          Instagram
        </a>
      </div>
      <p className="mt-2">
        © {new Date().getFullYear()} {siteConfig.nombre}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
