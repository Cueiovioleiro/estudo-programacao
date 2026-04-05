import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

let supabase = null;

try {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = await import("./supabase-config.js");
  if (
    SUPABASE_URL?.includes("SEU-PROJETO") ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY.includes("COLE_AQUI")
  ) {
    throw new Error("Edite supabase-config.js com as chaves do painel Supabase.");
  }
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn("[Supabase]", e.message || e);
}

function showAuthMessage(text, isError) {
  let el = document.getElementById("auth-message");
  if (!el) {
    el = document.createElement("p");
    el.id = "auth-message";
    el.setAttribute("role", "status");
    const container = document.querySelector(".auth-container");
    if (container) container.insertBefore(el, container.children[1] || null);
  }
  el.textContent = text;
  el.style.color = isError ? "#f87171" : "var(--auth-msg-ok, #22c55e)";
  el.style.textAlign = "center";
  el.style.marginBottom = "12px";
}

const loginFormEl = document.getElementById("login");
const registerFormEl = document.getElementById("register");

if (loginFormEl) {
  loginFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!supabase) {
      showAuthMessage("Configure web01/supabase-config.js (copie o .example).", true);
      return;
    }
    const email = loginFormEl.querySelector('input[type="email"]')?.value?.trim();
    const password = loginFormEl.querySelector('input[type="password"]')?.value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showAuthMessage(error.message, true);
      return;
    }
    showAuthMessage("Sessão iniciada. A redirecionar…", false);
    window.location.href = "index.html";
  });
}

if (registerFormEl) {
  registerFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!supabase) {
      showAuthMessage("Configure web01/supabase-config.js (copie o .example).", true);
      return;
    }
    const inputs = registerFormEl.querySelectorAll("input");
    const name = inputs[0]?.value?.trim();
    const email = inputs[1]?.value?.trim();
    const password = inputs[2]?.value;
    const password2 = inputs[3]?.value;
    if (password !== password2) {
      showAuthMessage("As senhas não coincidem.", true);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      showAuthMessage(error.message, true);
      return;
    }
    showAuthMessage(
      "Conta criada. Se o projeto exigir confirmação por email, verifique a caixa de entrada.",
      false
    );
  });
}
