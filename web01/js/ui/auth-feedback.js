import { SELECTORS } from "../app/constants.js";

/**
 * Exibe mensagem de feedback para operações de autenticação
 * @param {string} text Texto da mensagem
 * @param {boolean} isError Indica se é uma mensagem de erro
 * @param {Element} [container] Container opcional onde exibir a mensagem
 */
export function showAuthMessage(text, isError, container = null) {
  let el = document.getElementById("auth-message");

  if (!el) {
    el = document.createElement("p");
    el.id = "auth-message";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");

    const targetContainer = container || document.querySelector(SELECTORS.authContainer);
    if (targetContainer) {
      // Inserir após o primeiro filho ou no início
      const firstChild = targetContainer.firstElementChild;
      targetContainer.insertBefore(el, firstChild ? firstChild.nextSibling : targetContainer.firstChild);
    }
  }

  el.textContent = text;
  el.className = isError ? "auth-message-error" : "auth-message-success";

  // Remover mensagem após 5 segundos se for sucesso
  if (!isError) {
    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 5000);
  }
}

/**
 * Limpa mensagens de autenticação
 */
export function clearAuthMessages() {
  const el = document.getElementById("auth-message");
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}
