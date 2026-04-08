function irParaLogin() {
    window.location.href = "login.html";
}

function toggleForm() {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const formTitle = document.getElementById('formTitle');
    const toggleLink = document.getElementById('toggleLink');

    const isLogin = loginForm.style.display !== 'none';

    if (isLogin) {
        // Mudar para modo cadastro
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        formTitle.textContent = 'Criar Conta';
        toggleLink.textContent = 'Já tenho conta';
    } else {
        // Mudar para modo login
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
        formTitle.textContent = 'Entrar na Conta';
        toggleLink.textContent = 'Criar conta';
    }
}

// Função para verificar se o usuário está logado (usada em páginas futuras)
function verificarLogin() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "login.html";
    }
}
