/**
 * Gerenciador de estado global da aplicação
 * Implementa padrão Observer para atualizações reativas com suporte a middlewares
 */
export class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = [];
    this.middleware = [];
    this.history = [];
    this.maxHistory = 50;
  }

  /**
   * Adiciona middleware ao gerenciador de estado
   * @param {Function} middleware Função middleware que recebe (store, next, action)
   */
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Obtém o estado atual
   * @returns {Object} Estado atual
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Atualiza o estado e notifica listeners
   * @param {Object} newState Novo estado parcial
   * @param {string} actionType Tipo da ação para tracking (opcional)
   */
  setState(newState, actionType = 'UNKNOWN') {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // Adicionar ao histórico para time-travel debugging
    this.history.push({
      prevState,
      nextState: this.state,
      action: actionType,
      timestamp: Date.now()
    });

    // Limitar tamanho do histórico
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.notifyListeners(prevState, this.state, actionType);
  }

  /**
   * Desfaz a última alteração de estado (time-travel debugging)
   * @returns {Object|null} Estado anterior ou null se não houver histórico
   */
  undo() {
    if (this.history.length === 0) return null;

    const lastEntry = this.history.pop();
    this.state = { ...lastEntry.prevState };
    this.notifyListeners(lastEntry.prevState, lastEntry.nextState, 'UNDO');
    return this.state;
  }

  /**
   * Adiciona listener para mudanças de estado
   * @param {Function} callback Callback a ser chamado quando o estado muda
   * @returns {Function} Função para remover o listener
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notifica todos os listeners sobre mudança de estado
   * @private
   */
  notifyListeners(prevState, newState, actionType) {
    this.listeners.forEach(listener => listener(newState, prevState, actionType));
  }
}

// Instância singleton do gerenciador de estado
const globalStateManager = new StateManager({
  user: null,
  isAuthenticated: false,
  theme: localStorage.getItem('theme') || 'light',
  loading: false
});

// Middleware de persistência automática para certos campos
globalStateManager.addMiddleware((store, next, action) => {
  const result = next(action);
  const state = store.getState();

  // Persistir tema automaticamente
  if (state.theme) {
    localStorage.setItem('theme', state.theme);
  }

  return result;
});

export default globalStateManager;