import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

let client = null;

function isPlaceholderConfig(url, key) {
  const u = String(url || "").toLowerCase();
  const k = String(key || "");
  return (
    !url ||
    !key ||
    u.includes("seu-projeto") ||
    k.includes("COLE_AQUI")
  );
}

/**
 * Carrega config de js/config/ ou da raiz web01/ (migração gradual).
 */
async function loadSupabaseConfig() {
  try {
    return await import("../config/supabase-config.js");
  } catch {
    return await import("../../supabase-config.js");
  }
}

/**
 * Inicializa o cliente uma vez. Chamadas seguintes devolvem a mesma instância.
 */
export async function initSupabase() {
  if (client) {
    return { client, error: null };
  }
  let mod;
  try {
    mod = await loadSupabaseConfig();
  } catch {
    return {
      client: null,
      error: new Error(
        "Crie web01/js/config/supabase-config.js (copie o .example) ou use web01/supabase-config.js na raiz."
      ),
    };
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = mod;
  if (isPlaceholderConfig(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return {
      client: null,
      error: new Error("Edite supabase-config.js com as chaves do painel Supabase."),
    };
  }

  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return { client, error: null };
}

export function getSupabase() {
  return client;
}
