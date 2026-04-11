import { STORAGE_KEYS } from "../app/constants.js";

/**
 * Aplica o tema salvo no localStorage ao carregar a página
 */
function applyStoredTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  syncDarkButtonLabel();
}

/**
 * Sincroniza o texto do botão de dark mode com o estado atual
 */
function syncDarkButtonLabel() {
  const btn = document.getElementById("dk");
  if (!btn) return;
  btn.textContent = document.body.classList.contains("dark") ? "Escuro" : "Claro";
}

/**
 * Inicializa o painel de configurações e o dark mode.
 * Deve ser chamado uma vez por página.
 */
export function initSettings() {
  applyStoredTheme();

  const settingsBtn = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  const closeSettings = document.getElementById("close-settings");
  const darkButton = document.getElementById("dk");

  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener("click", () => {
      const isOpen = settingsPanel.style.display === "block";
      settingsPanel.style.display = isOpen ? "none" : "block";
    });
  }

  if (closeSettings && settingsPanel) {
    closeSettings.addEventListener("click", () => {
      settingsPanel.style.display = "none";
    });
  }

  if (darkButton) {
    darkButton.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem(STORAGE_KEYS.theme, isDark ? "dark" : "light");
      syncDarkButtonLabel();
    });
  }
}
