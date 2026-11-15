import mongoose from 'mongoose';

/**
 * Human-readable mapping for Mongoose connection readyState codes.
 */
export const CONNECTION_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Checks whether Mongoose currently has an active, ready connection.
 * @returns {boolean}
 */
export function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

/**
 * Returns the current connection state as a readable string.
 * @returns {'disconnected' | 'connected' | 'connecting' | 'disconnecting' | 'uninitialized'}
 */
export function getDbConnectionState() {
  const readyState = mongoose.connection?.readyState;
  return CONNECTION_STATES[readyState] || 'uninitialized';
}

/**
 * Returns connection diagnostic metadata for health-checks and telemetry.
 * Does not expose passwords or sensitive connection strings.
 * @returns {{ state: string, readyState: number, host: string | null, name: string | null }}
 */
export function getDbStats() {
  const conn = mongoose.connection;
  return {
    state: getDbConnectionState(),
    readyState: conn?.readyState ?? 0,
    host: conn?.host || null,
    name: conn?.name || null,
  };
}

export default {
  isDbConnected,
  getDbConnectionState,
  getDbStats,
};
