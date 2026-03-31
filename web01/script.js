// Seleciona o botão de modo escuro pelo ID
const darkButton = document.getElementById('dk');
// Seleciona o elemento body da página
const body = document.body;

// Inicializa com o modo escuro ativado
body.classList.add('dark');
darkButton.textContent = 'on';

// Adiciona um ouvinte de evento de clique ao botão
darkButton.addEventListener('click', () => {
    // Alterna a classe 'dark' no body para ativar/desativar o modo escuro
    body.classList.toggle('dark');
    // Verifica se o modo escuro está ativado
    if (body.classList.contains('dark')) {
        // Muda o texto do botão para 'on'
        darkButton.textContent = 'on';
    } else {
        // Muda o texto do botão para 'dark'
        darkButton.textContent = 'dark';
    }
});
