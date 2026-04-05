# estudo-programacao

Repositório para estudos e projetos em programação (incluindo trabalho em dupla).

## Projeto atual: `web01`

Site estático (HTML, CSS, JavaScript) com página inicial, login/cadastro e integração **Supabase** (autenticação).

| Ficheiro / pasta | Função |
|------------------|--------|
| `web01/index.html` | Página inicial |
| `web01/login.html` | Login e registo (módulo `js/pages/login.page.js`) |
| `web01/js/app/constants.js` | Rotas e constantes partilhadas |
| `web01/js/services/supabase-client.js` | Cliente Supabase (singleton, init lazy) |
| `web01/js/services/auth.service.js` | Operações de auth (camada sobre a API) |
| `web01/js/ui/auth-feedback.js` | Mensagens de estado na página de login |
| `web01/js/pages/login.page.js` | Entrada da página de login (DOM + fluxos) |
| `web01/ui.js` | UI geral (ex.: painel de definições, tema) |
| `web01/script.js` | Lógica da página inicial (ex.: botão “Começar Agora”) |
| `web01/style.css` | Estilos |
| `web01/js/config/supabase-config.example.js` | Modelo de configuração (pode ir para o Git) |
| `web01/supabase-config.js` ou `web01/js/config/supabase-config.js` | **Chaves reais — não commitar** (ambos no `.gitignore` quando aplicável) |

### Para a tua dupla continuar (setup local)

1. **Clonar e atualizar:** `git clone …` e `git pull` na branch em que estão a trabalhar (ex.: `main`).
2. **Configurar Supabase:** copiar o modelo e preencher com o projeto partilhado no painel Supabase (Project Settings → API):
   - Copiar `web01/js/config/supabase-config.example.js` para `web01/js/config/supabase-config.js`, **ou** para `web01/supabase-config.js` na raiz do site (o cliente tenta os dois caminhos).
   - Colar **URL** e **anon public key** (a chave anon é pensada para o browser; mesmo assim não commits `supabase-config.js`).
3. **Abrir o site com um servidor local** (recomendado: os ficheiros usam `import` ES modules; abrir só o ficheiro no disco pode falhar):
   - Na pasta do repo: `npx --yes serve web01` e abrir o URL indicado no terminal, ou
   - Extensão “Live Server” no VS Code/Cursor apontando para `web01/`.
4. **Fluxo:** `index.html` → “Começar Agora” → `login.html` (registo/login).

Se `supabase-config.js` estiver em falta ou ainda tiver placeholders (`SEU-PROJETO` / `COLE_AQUI`), a app avisa para configurar o ficheiro.

### Git

- Não adicionar `web01/supabase-config.js` nem `web01/js/config/supabase-config.js` ao repositório (já ignorados quando existirem).
- Comunicar na equipa qual branch usar e fazer commits/push com mensagens claras para a outra pessoa acompanhar.

---
*Estruturas antigas do README (`exercicios/`, `projetos/`) foram removidas da descrição até existirem no repositório.*
