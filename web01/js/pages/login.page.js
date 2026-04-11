import { ROUTES } from "../app/constants.js";
import { initSupabase, getSupabase } from "../services/supabase-client.js";
import {
  MIN_REGISTRATION_AGE,
  isAtLeastMinAge,
  signInWithPassword,
  signUp,
  validatePasswordMatch,
} from "../services/auth.service.js";
import { showAuthMessage } from "../ui/auth-feedback.js";
import { initSettings } from "../ui/settings.js";

function setRegisterBirthDateMax() {
  const birthInput = document.getElementById("register-birth");
  if (!birthInput) return;
  const d = new Date();
  d.setFullYear(d.getFullYear() - MIN_REGISTRATION_AGE);
  birthInput.max = d.toISOString().slice(0, 10);
}

function wireLoginTab() {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (!loginTab || !registerTab) return;

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    if (loginForm) loginForm.classList.add("active");
    if (registerForm) registerForm.classList.remove("active");
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    if (registerForm) registerForm.classList.add("active");
    if (loginForm) loginForm.classList.remove("active");
  });
}

async function bootstrap() {
  initSettings();
  wireLoginTab();
  setRegisterBirthDateMax();

  const { client: supabase, error: initErr } = await initSupabase();
  if (initErr) {
    console.warn("[Supabase]", initErr.message || initErr);
  }

  const loginFormEl = document.getElementById("login");
  const registerFormEl = document.getElementById("register");

  if (loginFormEl) {
    loginFormEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const sb = getSupabase();
      if (!sb) {
        showAuthMessage(
          initErr?.message ||
            "Configure supabase-config.js (veja js/config/supabase-config.example.js).",
          true
        );
        return;
      }
      const email = loginFormEl.querySelector('input[type="email"]')?.value?.trim();
      const password = loginFormEl.querySelector('input[type="password"]')?.value;
      const { error } = await signInWithPassword(sb, email, password);
      if (error) {
        showAuthMessage(error.message, true);
        return;
      }
      showAuthMessage("Sessão iniciada. Abrindo…", false);
      window.open(ROUTES.dashboard, "_blank");
    });
  }

  if (registerFormEl) {
    registerFormEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const sb = getSupabase();
      if (!sb) {
        showAuthMessage(
          initErr?.message ||
            "Configure supabase-config.js (veja js/config/supabase-config.example.js).",
          true
        );
        return;
      }
      const fullName = document.getElementById("register-name")?.value?.trim();
      const email = document.getElementById("register-email")?.value?.trim();
      const birthDate = document.getElementById("register-birth")?.value;
      const password = document.getElementById("register-password")?.value;
      const password2 = document.getElementById("register-password2")?.value;
      if (!isAtLeastMinAge(birthDate, MIN_REGISTRATION_AGE)) {
        showAuthMessage("É necessário ter pelo menos 18 anos para se cadastrar.", true);
        return;
      }
      if (!validatePasswordMatch(password, password2)) {
        showAuthMessage("As senhas não coincidem.", true);
        return;
      }
      const { error } = await signUp(sb, { email, password, fullName, birthDate });
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
}

bootstrap();
