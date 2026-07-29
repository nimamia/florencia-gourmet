import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con la service role key: acceso privilegiado, bypassa RLS.
 * Solo debe usarse en código de servidor ya protegido (server actions del admin, scripts).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
