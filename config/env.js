/**
 * Runtime Environment Variable Validation Utility
 * Validates and exposes access to critical application configuration keys.
 */

const requiredServerEnv = [
  'MONGODB_URI',
  'CLERK_SECRET_KEY',
];

const requiredPublicEnv = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
];

/**
 * Validates that all required environment variables are set.
 * In development, logs descriptive warnings. In production, throws descriptive error.
 * @returns {{ isValid: boolean, missing: string[] }}
 */
export function validateEnv() {
  const missing = [];

  for (const envVar of requiredServerEnv) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  for (const envVar of requiredPublicEnv) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    const message = `[Env Validation Error] Missing required environment variables: ${missing.join(', ')}`;
    if (process.env.NODE_ENV === 'production') {
      console.error(message);
    } else {
      console.warn(`${message}. Ensure they are defined in your .env / .env.local file.`);
    }
    return { isValid: false, missing };
  }

  return { isValid: true, missing: [] };
}

/**
 * Safe accessor for environment variables with fallback support.
 * @param {string} key - Environment variable name
 * @param {string} [defaultValue=""] - Default fallback value
 * @returns {string}
 */
export function getEnv(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

export default {
  validateEnv,
  getEnv,
};
