/**
 * Serviço de gerenciamento de sessão
 * Centraliza a lógica de sessão e persistência de dados do usuário
 */
import { getSupabase } from './supabase-client.js';
import { isAuthenticated, getCurrentUser } from './auth.service.js';

class SessionService {
  constructor() {
    this.session = null;
    this.user = null;
    this.isAuthenticated = false;
    this.listeners = [];

    // Monitora alterações de autenticação
    this.setupAuthListener();
  }

  /**
   * Configura listener para eventos de autenticação
   */
  setupAuthListener() {
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.onAuthStateChange(async (event, session) => {
        this.session = session;
        if (session) {
          this.user = session.user;
          this.isAuthenticated = true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
        this.notifyListeners();
      });
    }
  }

  /**
   * Obtém o usuário atual
   * @returns {Object|null} Usuário atual ou null se não estiver autenticado
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {Promise<boolean>} True se o usuário estiver autenticado
   */
  async isAuthenticated() {
    const supabase = getSupabase();
    if (!supabase) return false;

    return await isAuthenticated(supabase);
  }

  /**
   * Obtém dados da sessão
   * @returns {Object|null} Dados da sessão
   */
  getSession() {
    return this.session;
  }

  /**
   * Adiciona listener para mudanças de sessão
   * @param {Function} callback Callback a ser chamado quando a sessão muda
   * @returns {Function} Função para remover o listener
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notifica todos os listeners sobre mudança de sessão
   * @private
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener({
      user: this.user,
      isAuthenticated: this.isAuthenticated,
      session: this.session
    }));
  }

  /**
   * Limpa os dados da sessão
   */
  clearSession() {
    this.session = null;
    this.user = null;
    this.isAuthenticated = false;
    this.notifyListeners();
  }
}

// Instância singleton do serviço de sessão
const sessionService = new SessionService();
export default sessionService;