/**
 * Serviço de validação de formulários
 * Fornece funções de validação reutilizáveis para diferentes tipos de campos
 */

/**
 * Validações básicas
 */
export const Validators = {
  /**
   * Valida se o valor não está vazio
   * @param {string} value Valor a ser validado
   * @returns {boolean} True se válido
   */
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value != null && value !== '';
  },

  /**
   * Valida formato de email
   * @param {string} email Email a ser validado
   * @returns {boolean} True se for um email válido
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida tamanho mínimo
   * @param {string} value Valor a ser validado
   * @param {number} minLength Tamanho mínimo
   * @returns {boolean} True se válido
   */
  minLength: (value, minLength) => {
    return typeof value === 'string' && value.length >= minLength;
  },

  /**
   * Valida tamanho máximo
   * @param {string} value Valor a ser validado
   * @param {number} maxLength Tamanho máximo
   * @returns {boolean} True se válido
   */
  maxLength: (value, maxLength) => {
    return typeof value === 'string' && value.length <= maxLength;
  },

  /**
   * Valida força de senha
   * @param {string} password Senha a ser validada
   * @returns {boolean} True se for uma senha forte
   */
  strongPassword: (password) => {
    // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },

  /**
   * Valida se duas senhas coincidem
   * @param {string} password Primeira senha
   * @param {string} confirmPassword Segunda senha
   * @returns {boolean} True se as senhas coincidirem
   */
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },

  /**
   * Valida formato de telefone
   * @param {string} phone Telefone a ser validado
   * @returns {boolean} True se for um telefone válido
   */
  phone: (phone) => {
    // Formato brasileiro: (XX) XXXXX-XXXX ou XXXXXXXXXXX
    const phoneRegex = /^(\([0-9]{2}\) [0-9]{5}-[0-9]{4}|[0-9]{11})$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }
};

/**
 * Classe para validação de formulários
 */
export class FormValidator {
  constructor() {
    this.rules = {};
    this.messages = {};
  }

  /**
   * Define regras de validação para um campo
   * @param {string} field Nome do campo
   * @param {Array<{validator: Function, message: string}>} rules Regras de validação
   * @returns {FormValidator} Instância atual para encadeamento
   */
  addRule(field, rules) {
    this.rules[field] = rules;
    return this;
  }

  /**
   * Define mensagem personalizada para um campo
   * @param {string} field Nome do campo
   * @param {string} message Mensagem personalizada
   * @returns {FormValidator} Instância atual para encadeamento
   */
  setMessage(field, message) {
    this.messages[field] = message;
    return this;
  }

  /**
   * Valida os dados do formulário
   * @param {Object} data Dados do formulário
   * @returns {Object} Resultado da validação
   */
  validate(data) {
    const errors = {};

    for (const [field, rules] of Object.entries(this.rules)) {
      for (const rule of rules) {
        if (!rule.validator(data[field], data)) {
          errors[field] = rule.message;
          break; // Parar no primeiro erro
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validação individual de um campo
   * @param {string} field Nome do campo
   * @param {*} value Valor do campo
   * @param {Object} formData Dados completos do formulário
   * @returns {string|null} Mensagem de erro ou null se válido
   */
  validateField(field, value, formData = {}) {
    const rules = this.rules[field];
    if (!rules) return null;

    for (const rule of rules) {
      if (!rule.validator(value, formData)) {
        return rule.message;
      }
    }

    return null;
  }
}

/**
 * Validador pré-configurado para formulário de login
 */
export const loginValidator = new FormValidator()
  .addRule('email', [
    { validator: Validators.required, message: 'Email é obrigatório' },
    { validator: Validators.email, message: 'Formato de email inválido' }
  ])
  .addRule('password', [
    { validator: Validators.required, message: 'Senha é obrigatória' },
    { validator: Validators.minLength.bind(null, null, 6), message: 'Senha deve ter pelo menos 6 caracteres' }
  ]);

/**
 * Validador pré-configurado para formulário de cadastro
 */
export const registerValidator = new FormValidator()
  .addRule('fullName', [
    { validator: Validators.required, message: 'Nome completo é obrigatório' },
    { validator: Validators.minLength.bind(null, null, 2), message: 'Nome deve ter pelo menos 2 caracteres' },
    { validator: Validators.maxLength.bind(null, null, 100), message: 'Nome deve ter no máximo 100 caracteres' }
  ])
  .addRule('email', [
    { validator: Validators.required, message: 'Email é obrigatório' },
    { validator: Validators.email, message: 'Formato de email inválido' }
  ])
  .addRule('birthDate', [
    { validator: Validators.required, message: 'Data de nascimento é obrigatória' }
  ])
  .addRule('password', [
    { validator: Validators.required, message: 'Senha é obrigatória' },
    { validator: Validators.minLength.bind(null, null, 6), message: 'Senha deve ter pelo menos 6 caracteres' },
    { validator: Validators.strongPassword, message: 'Senha deve conter maiúscula, minúscula, número e caractere especial' }
  ])
  .addRule('passwordConfirm', [
    { validator: (value, formData) => Validators.passwordsMatch(formData.password, value), message: 'As senhas não coincidem' }
  ]);