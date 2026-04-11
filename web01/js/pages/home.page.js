import { ROUTES } from "../app/constants.js";
import { initSettings } from "../ui/settings.js";

function wireCTA() {
  const ctaButton = document.getElementById("cta");
  if (ctaButton) {
    ctaButton.addEventListener("click", () => {
      window.location.href = ROUTES.login;
    });
  }
}

function bootstrap() {
  initSettings();
  wireCTA();
}

bootstrap();
