export function formatPrice(value: number | string): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
}

export function generarNumeroOrden(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FG-${timestamp}${aleatorio}`;
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
