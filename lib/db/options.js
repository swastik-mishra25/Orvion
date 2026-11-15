/**
 * Optimized Connection Options for Serverless MongoDB
 *
 * Configures connection pooling, timeouts, and buffering behavior
 * specifically tailored for serverless execution lifecycles and ephemeral containers.
 */

/**
 * Returns Mongoose connect options optimized for serverless environments.
 * @returns {import('mongoose').ConnectOptions}
 */
export function getServerlessMongooseOptions() {
  return {
    // Disable mongoose buffering: fail fast if connection is not ready
    bufferCommands: false,

    // Maintain a conservative pool size per serverless lambda/container
    // to avoid saturating connection limits during auto-scaling bursts
    maxPoolSize: 10,
    minPoolSize: 0,

    // Fast-fail connection timeout when MongoDB host is unreachable
    serverSelectionTimeoutMS: 5000,

    // Socket inactivity timeout
    socketTimeoutMS: 45000,

    // Heartbeat frequency for monitoring replica sets / cluster topology
    heartbeatFrequencyMS: 10000,
  };
}

export default getServerlessMongooseOptions;
