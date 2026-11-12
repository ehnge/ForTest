import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureAnonymousSession(client: SupabaseClient | null) {
  if (!client) return { userId: null, warning: "Supabase is not configured. Cloud save is unavailable." };
  const current = await client.auth.getSession();
  if (current.data.session?.user) return { userId: current.data.session.user.id };
  const created = await client.auth.signInAnonymously();
  if (created.error || !created.data.user) return { userId: null, warning: created.error?.message ?? "Anonymous session could not be created." };
  return { userId: created.data.user.id };
}
