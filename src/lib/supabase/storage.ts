import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET!;

export async function subirImagenProducto(archivo: File): Promise<string> {
  const supabase = createAdminClient();
  const extension = archivo.name.split(".").pop() ?? "jpg";
  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nombreArchivo, archivo, { contentType: archivo.type });

  if (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo);
  return data.publicUrl;
}

export async function eliminarImagenProducto(url: string): Promise<void> {
  const supabase = createAdminClient();
  const nombreArchivo = url.split(`/${BUCKET}/`).pop();
  if (!nombreArchivo) return;
  await supabase.storage.from(BUCKET).remove([nombreArchivo]);
}
