import crypto from 'crypto';

/**
 * Generates a random salt and hashes the password using PBKDF2.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verifies a plaintext password against a stored hash and salt.
 */
export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  if (!password || !storedHash || !storedSalt) return false;
  try {
    const hash = crypto.pbkdf2Sync(password, storedSalt, 100000, 64, 'sha512').toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const storedHashBuffer = Buffer.from(storedHash, 'hex');
    if (hashBuffer.length !== storedHashBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, storedHashBuffer);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}
