import mongoose from 'mongoose';

/**
 * Safely compiles or retrieves a Mongoose model in Next.js environments.
 * Prevents "OverwriteModelError: Cannot overwrite model once compiled"
 * during Hot Module Replacement (HMR) and serverless function cold starts.
 *
 * @template T
 * @param {string} modelName - Name of the Mongoose model
 * @param {import('mongoose').Schema<T>} schema - Schema definition
 * @returns {import('mongoose').Model<T>}
 */
export function getOrCreateModel(modelName, schema) {
  if (mongoose.models && mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  return mongoose.model(modelName, schema);
}

export default getOrCreateModel;
