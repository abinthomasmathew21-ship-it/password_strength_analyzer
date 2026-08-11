/**
 * Hashes a string using Web Crypto API (SHA-256)
 */
export async function hashPasswordSha256(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes with SHA-1 (useful for HaveIBeenPwned k-Anonymity demonstration)
 */
export async function hashPasswordSha1(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Generates salted hash demo
 */
export async function generateSaltedHash(password: string, salt?: string): Promise<{ salt: string; hash: string }> {
  const currentSalt = salt || crypto.getRandomValues(new Uint8Array(16)).reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
  const saltedMsg = `${currentSalt}:${password}`;
  const hash = await hashPasswordSha256(saltedMsg);
  return { salt: currentSalt, hash };
}

/**
 * Mask password for display in history logs
 */
export function maskPassword(password: string): string {
  if (!password) return '';
  if (password.length <= 2) return '*'.repeat(password.length);
  return `${password[0]}${'*'.repeat(Math.min(password.length - 2, 8))}${password[password.length - 1]}`;
}
