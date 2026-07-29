"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ResultadoLogin = { ok: true } | { ok: false; error: string };

export async function iniciarSesion(email: string, password: string): Promise<ResultadoLogin> {
  if (!email || !password) {
    return { ok: false, error: "Ingresa tu correo y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: "Correo o contraseña incorrectos." };
  }

  return { ok: true };
}

export async function cerrarSesion(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
