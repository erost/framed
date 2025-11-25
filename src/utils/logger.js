/**
 * Logger utility
 * Provides logging methods that can be disabled in production
 */

/**
 * Check if we're in production mode
 */
const isProduction = import.meta.env.PROD;

/**
 * Log error message
 * In production, errors are silently ignored to avoid exposing implementation details
 * @param  {...any} args - Arguments to log
 */
export const logError = (...args) => {
  if (!isProduction) {
    console.error(...args);
  }
};
