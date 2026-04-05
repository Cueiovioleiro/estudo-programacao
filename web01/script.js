// script.js - Scripts de lógica geral

// Seleciona o botão "Começar Agora"
const ctaButton = document.getElementById('cta');

// Adiciona ouvinte de evento para carregar nova página
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// Login/cadastro: ver auth-supabase.js (carregado só em login.html)
