import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
      © {new Date().getFullYear()} {siteConfig.nombre}. {siteConfig.descripcion}.
    </footer>
  );
}
