/**
 * Camada aprimorada sobre Supabase Auth com tratamento de erros, retry logic e refresh token
 */

export const MIN_REGISTRATION_AGE = 18;

// Configuração de retry
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 segundo
  maxDelay: 10000, // 10 segundos
};

/**
 * Executa uma operação com retry exponencial
 * @param {Function} operation Função que retorna uma promise
 * @param {Object} config Configuração de retry
 * @returns {Promise<any>} Resultado da operação
 */
async function retryOperation(operation, config = RETRY_CONFIG) {
  let lastError;
  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === config.maxAttempts - 1) break;

      // Calcular delay com exponencial backoff e jitter
      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt) + Math.random() * 100,
        config.maxDelay
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

/**
 * Trata erros do Supabase de forma padronizada
 * @param {Error} error Erro capturado
 * @returns {Object} Objeto de erro padronizado
 */
function handleSupabaseError(error) {
  // Erros comuns do Supabase Auth
  if (error.message.includes('Invalid login credentials')) {
    return {
      ...error,
      type: 'INVALID_CREDENTIALS',
      message: 'Email ou senha incorretos'
    };
  }

  if (error.message.includes('Email not confirmed')) {
    return {
      ...error,
      type: 'EMAIL_NOT_CONFIRMED',
      message: 'Email não confirmado. Verifique sua caixa de entrada'
    };
  }

  if (error.message.includes('Too many requests')) {
    return {
      ...error,
      type: 'RATE_LIMITED',
      message: 'Muitas tentativas. Por favor, aguarde alguns minutos'
    };
  }

  if (error.message.includes('User not found')) {
    return {
      ...error,
      type: 'USER_NOT_FOUND',
      message: 'Usuário não encontrado'
    };
  }

  // Erro genérico
  return {
    ...error,
    type: 'AUTH_ERROR',
    message: error.message || 'Erro de autenticação'
  };
}

/**
 * @param {string} birthDateValue Valor de input type="date" (YYYY-MM-DD)
 */
export function isAtLeastMinAge(birthDateValue, minAge = MIN_REGISTRATION_AGE) {
  if (!birthDateValue) return false;
  const parts = birthDateValue.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return false;
  const [y, m, day] = parts;
  const birth = new Date(y, m - 1, day);
  if (Number.isNaN(birth.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= minAge;
}

/**
 * Faz login com email e senha com retry e tratamento de erro aprimorado
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase Cliente Supabase
 * @param {string} email Email do usuário
 * @param {string} password Senha do usuário
 * @returns {Promise<Object>} Resultado da operação de login
 */
export async function signInWithPassword(supabase, email, password) {
  return retryOperation(() =>
    supabase.auth.signInWithPassword({ email, password })
  ).catch(handleSupabaseError);
}

/**
 * Realiza cadastro de novo usuário com retry e tratamento de erro
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase Cliente Supabase
 * @param {Object} userData Dados do usuário
 * @param {string} userData.email Email do usuário
 * @param {string} userData.password Senha do usuário
 * @param {string} userData.fullName Nome completo
 * @param {string} userData.birthDate Data de nascimento
 * @returns {Promise<Object>} Resultado da operação de cadastro
 */
export async function signUp(supabase, { email, password, fullName, birthDate }) {
  return retryOperation(() =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...(birthDate ? { birth_date: birthDate } : {}),
        },
      },
    })
  ).catch(handleSupabaseError);
}

/**
 * Valida se as senhas coincidem
 * @param {string} password Primeira senha
 * @param {string} passwordConfirm Confirmação de senha
 * @returns {boolean} True se as senhas coincidirem
 */
export function validatePasswordMatch(password, passwordConfirm) {
  return password === passwordConfirm;
}

/**
 * Faz logout do usuário com tratamento de erro
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase Cliente Supabase
 * @returns {Promise<Object>} Resultado da operação de logout
 */
export async function signOut(supabase) {
  return retryOperation(() => supabase.auth.signOut()).catch(handleSupabaseError);
}

/**
 * Obtém o usuário atual
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase Cliente Supabase
 * @returns {Object|null} Dados do usuário ou null se não estiver autenticado
 */
export function getCurrentUser(supabase) {
  try {
    return supabase.auth.getUser();
  } catch (error) {
    console.error('Erro ao obter usuário atual:', handleSupabaseError(error));
    return null;
  }
}

/**
 * Verifica se o usuário está autenticado com tratamento de erro
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase Cliente Supabase
 * @returns {Promise<boolean>} True se o usuário estiver autenticado
 */
export async function isAuthenticated(supabase) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return !!user && !error;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', handleSupabaseError(error));
    return false;
  }
}

/**
 * Atualiza dados do perfil do usuário com tratamento de erro
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase Cliente Supabase
 * @param {Object} profileData Dados do perfil a serem atualizados
 * @returns {Promise<Object>} Resultado da operação de atualização
 */
export async function updateProfile(supabase, profileData) {
  return retryOperation(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    return supabase
      .from('profiles')
      .upsert({ id: user.id, updated_at: new Date(), ...profileData );
  }).catch(handleSupabaseError);
}

/**
 * Renova o token de acesso se estiver expirado
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase Cliente Supabase
 * @returns {Promise<Object>} Resultado da operação de refresh
 */
export async function refreshSession(supabase) {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return { data: { session }, error: null };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

/**
 * Verifica se o token está próximo de expirar (menos de 5 minutos)
 * @param {Object} session Sessão do Supabase
 * @returns {boolean} True se o token precisa ser renovado
 */
export function isTokenExpiringSoon(session) {
  if (!session || !session.expires_at) return false;

  const expiresIn = session.expires_at - Date.now() / 1000;
  return expiresIn < 300; // 5 minutos
}
