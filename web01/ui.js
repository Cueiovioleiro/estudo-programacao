// ui.js - Scripts relacionados à interface e CSS

// Seleciona os elementos de UI
const darkButton = document.getElementById('dk');
const body = document.body;
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');

function syncDarkButtonLabel() {
    if (!darkButton || !body) return;
    darkButton.textContent = body.classList.contains('dark') ? 'Escuro' : 'Claro';
}

if (body) {
    syncDarkButtonLabel();
}

// Função para alternar o painel de configurações
function toggleSettings() {
  if (settingsPanel) {
    if (settingsPanel.style.display === 'none' || settingsPanel.style.display === '') {
      settingsPanel.style.display = 'block';
    } else {
      settingsPanel.style.display = 'none';
    }
  }
}

// Adiciona ouvintes de evento para configurações
if (settingsBtn) {
    settingsBtn.addEventListener('click', toggleSettings);
}
if (closeSettings) {
    closeSettings.addEventListener('click', () => {
        if (settingsPanel) settingsPanel.style.display = 'none';
    });
}

// Adiciona um ouvinte de evento de clique ao botão de modo escuro
if (darkButton) {
    darkButton.addEventListener('click', () => {
        if (body) {
            body.classList.toggle('dark');
            syncDarkButtonLabel();
        }
    });
}

// Código para as abas de login e cadastro
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        if (loginForm) loginForm.classList.add('active');
        if (registerForm) registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        if (registerForm) registerForm.classList.add('active');
        if (loginForm) loginForm.classList.remove('active');
    });
}