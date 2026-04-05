/**
 * Camada fina sobre Supabase Auth — testes e troca de backend ficam isolados aqui.
 */

export const MIN_REGISTRATION_AGE = 18;

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

export async function signInWithPassword(supabase, email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(supabase, { email, password, fullName, birthDate }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        ...(birthDate ? { birth_date: birthDate } : {}),
      },
    },
  });
}

export function validatePasswordMatch(password, passwordConfirm) {
  return password === passwordConfirm;
}
