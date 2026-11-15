/**
 * Global Mongoose Connection Cache for Serverless Environments
 *
 * In serverless environments (AWS Lambda, Vercel, Next.js Server Components / Route Handlers)
 * and during development Hot Module Replacement (HMR), modules are frequently re-evaluated.
 * Caching the active connection and in-flight connection promise on the global object
 * prevents connection pooling leaks and MongoDB Atlas connection exhaustion.
 */

const GLOBAL_CACHE_KEY = Symbol.for('orvion.mongoose.cache');

/**
 * @typedef {Object} MongooseCache
 * @property {import('mongoose').Mongoose | null} conn
 * @property {Promise<import('mongoose').Mongoose> | null} promise
 */

/**
 * Initializes or retrieves the singleton connection cache from global scope.
 * @returns {MongooseCache}
 */
export function getConnectionCache() {
  if (!global[GLOBAL_CACHE_KEY]) {
    global[GLOBAL_CACHE_KEY] = {
      conn: null,
      promise: null,
    };
  }

  return global[GLOBAL_CACHE_KEY];
}

/**
 * Resets the connection cache (useful during testing or connection teardown).
 */
export function clearConnectionCache() {
  if (global[GLOBAL_CACHE_KEY]) {
    global[GLOBAL_CACHE_KEY].conn = null;
    global[GLOBAL_CACHE_KEY].promise = null;
  }
}

export default getConnectionCache;
