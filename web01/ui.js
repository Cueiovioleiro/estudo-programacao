// ui.js - Funções de interface e navegação

function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const isLogin = loginForm.getAttribute('data-mode') === 'login';
    
    if (isLogin) {
        // Mudar para modo cadastro
        document.querySelector('h2').textContent = 'Criar conta';
        document.getElementById('toggleLink').textContent = 'Já tenho conta';
        loginForm.setAttribute('data-mode', 'register');
    } else {
        // Mudar para modo login
        document.querySelector('h2').textContent = 'Entrar na conta';
        document.getElementById('toggleLink').textContent = 'Criar conta';
        loginForm.setAttribute('data-mode', 'login');
    }
}

function mostrarMensagem(texto, tipo) {
    const msg = document.createElement('div');
    msg.textContent = texto;
    msg.style.padding = '12px';
    msg.style.margin = '15px 0';
    msg.style.borderRadius = '8px';
    msg.style.color = tipo === 'sucesso' ? '#155724' : '#721c24';
    msg.style.backgroundColor = tipo === 'sucesso' ? '#d4edda' : '#f8d7da';
    document.querySelector('.login-container').appendChild(msg);
    
    setTimeout(() => msg.remove(), 4000);
}
