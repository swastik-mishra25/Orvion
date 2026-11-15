import mongoose from 'mongoose';

/**
 * Global flag to prevent duplicate event listener registration during HMR
 */
let isListenersAttached = false;

/**
 * Registers connection lifecycle listeners on Mongoose connection.
 * Idempotent: safe to invoke repeatedly across hot reloads and serverless invocations.
 */
export function registerConnectionEvents() {
  if (isListenersAttached) {
    return;
  }

  const { connection } = mongoose;

  connection.on('connected', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('MongoDB serverless connection established successfully.');
    }
  });

  connection.on('error', (err) => {
    console.error('MongoDB connection error:', err?.message || err);
  });

  connection.on('disconnected', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('MongoDB connection lost/disconnected.');
    }
  });

  connection.on('reconnected', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('MongoDB connection re-established.');
    }
  });

  isListenersAttached = true;
}

export default registerConnectionEvents;
