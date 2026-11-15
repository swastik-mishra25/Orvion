import mongoose from "mongoose";
import { getConnectionCache } from "@/lib/db/cache";
import { getServerlessMongooseOptions } from "@/lib/db/options";
import { registerConnectionEvents } from "@/lib/db/events";

/**
 * Serverless-optimized MongoDB connection singleton.
 * Reuses the active cached connection or in-flight promise across
 * serverless executions and Next.js Hot Module Replacement.
 *
 * @returns {Promise<import('mongoose').Mongoose>}
 */
async function connectDB() {
  const cached = getConnectionCache();

  if (cached.conn) {
    return cached.conn;
  }

      if (!cached.promise) {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
          throw new Error(
            "Invalid/Missing environment variable: 'MONGODB_URI'. Please define it in your environment configuration."
          );
        }

          // Attach lifecycle listeners once
          registerConnectionEvents();

        const options = {
          ...getServerlessMongooseOptions(),
          dbName: "orvion",
        };

        cached.promise = mongoose
          .connect(mongoUri, options)
          .then((mongooseInstance) => {
            return mongooseInstance;
          })
          .catch((error) => {
            // Reset promise cache so subsequent invocations can retry
            cached.promise = null;
            throw error;
          });
      }

      try {
        cached.conn = await cached.promise;
      } catch (error) {
        cached.promise = null;
        throw error;
      }

      return cached.conn;
    }

    export default connectDB;
