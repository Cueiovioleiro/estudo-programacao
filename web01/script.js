// script.js - Scripts de lógica geral

// Seleciona o botão "Começar Agora"
const ctaButton = document.getElementById('cta');

// Adiciona ouvinte de evento para carregar nova página
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        window.location.href = 'cursos.html';
    });
}

// Manipulação básica dos formulários de login e cadastro
const loginFormEl = document.getElementById('login');
const registerFormEl = document.getElementById('register');

if (loginFormEl) {
    loginFormEl.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login realizado com sucesso!');
        // falta lógica real de autenticação, como validação e verificação de credenciais
    });
}

if (registerFormEl) {
    registerFormEl.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Cadastro realizado com sucesso!');
        // falta lógica real de registro, como validação e armazenamento de dados
    });
}
