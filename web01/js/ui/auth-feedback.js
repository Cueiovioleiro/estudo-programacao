import { SELECTORS } from "../app/constants.js";

export function showAuthMessage(text, isError) {
  let el = document.getElementById("auth-message");
  if (!el) {
    el = document.createElement("p");
    el.id = "auth-message";
    el.setAttribute("role", "status");
    const container = document.querySelector(SELECTORS.authContainer);
    if (container) {
      container.insertBefore(el, container.children[1] || null);
    }
  }
  el.textContent = text;
  el.style.color = isError ? "#f87171" : "var(--auth-msg-ok, #22c55e)";
  el.style.textAlign = "center";
  el.style.marginBottom = "12px";
}
