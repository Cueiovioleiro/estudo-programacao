// script.js - Scripts de lógica geral

// Seleciona o botão "Começar Agora"
const ctaButton = document.getElementById('cta');

// Adiciona ouvinte de evento para carregar nova página
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// Login/cadastro: ver js/pages/login.page.js (carregado só em login.html)
