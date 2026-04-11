/**
 * Container de Injeção de Dependência simples
 * Gerencia o ciclo de vida dos serviços e fornece injeção de dependência
 */
class DIContainer {
  constructor() {
    this.services = new Map();
    this.factories = new Map();
    this.instances = new Map();
  }

  /**
   * Registra um serviço como singleton
   * @param {string} name - Nome do serviço
   * @param {Function|Class} service - Classe ou função factory do serviço
   * @param {Array<string>} dependencies - Lista de dependências do serviço
   */
  register(name, service, dependencies = []) {
    this.services.set(name, { service, dependencies, singleton: true });
    return this;
  }

  /**
   * Registra um serviço como transient (nova instância a cada chamada)
   * @param {string} name - Nome do serviço
   * @param {Function|Class} service - Classe ou função factory do serviço
   * @param {Array<string>} dependencies - Lista de dependências do serviço
   */
  registerTransient(name, service, dependencies = []) {
    this.services.set(name, { service, dependencies, singleton: false });
    return this;
  }

  /**
   * Registra uma factory function personalizada
   * @param {string} name - Nome do serviço
   * @param {Function} factory - Função que retorna a instância do serviço
   * @param {Array<string>} dependencies - Lista de dependências do serviço
   */
  registerFactory(name, factory, dependencies = []) {
    this.factories.set(name, { factory, dependencies });
    return this;
  }

  /**
   * Resolve uma dependência pelo nome
   * @param {string} name - Nome do serviço a ser resolvido
   * @returns {*} Instância do serviço
   */
  resolve(name) {
    // Verificar se é uma factory
    if (this.factories.has(name)) {
      const { factory, dependencies } = this.factories.get(name);
      const depInstances = dependencies.map(dep => this.resolve(dep));
      return factory(...depInstances);
    }

    // Verificar se é um serviço registrado
    if (!this.services.has(name)) {
      throw new Error(`Serviço não registrado: ${name}`);
    }

    const { service, dependencies, singleton } = this.services.get(name);

    // Se é singleton e já temos instância, retornar
    if (singleton && this.instances.has(name)) {
      return this.instances.get(name);
    }

    // Resolver dependências
    const depInstances = dependencies.map(dep => this.resolve(dep));

    // Criar instância
    let instance;
    if (typeof service === 'function') {
      instance = new service(...depInstances);
    } else {
      instance = service(...depInstances);
    }

    // Armazenar se for singleton
    if (singleton) {
      this.instances.set(name, instance);
    }

    return instance;
  }

  /**
   * Remove uma instância do container (útil para testes)
   * @param {string} name - Nome do serviço
   */
  remove(name) {
    this.services.delete(name);
    this.factories.delete(name);
    this.instances.delete(name);
  }

  /**
   * Limpa todas as instâncias singleton (útil para testes)
   */
  clearInstances() {
    this.instances.clear();
  }
}

// Exportar instância singleton do container
const diContainer = new DIContainer();
export default diContainer;