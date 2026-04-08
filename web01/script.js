function irParaLogin() {
    window.location.href = "login.html";
}

// Função para verificar se o usuário está logado (usada em páginas futuras)
function verificarLogin() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "login.html";
    }
}
