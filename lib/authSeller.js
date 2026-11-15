import { isAdmin } from "@/lib/auth/guards";

/**
 * Checks whether the user is authorized as seller/admin.
 * Maintained for backward compatibility across API routes.
 *
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
const authSeller = async (userId) => {
    try {
      return await isAdmin(userId);
    } catch (error) {
      console.error("authSeller check error:", error?.message || error);
      return false;
    }
  };

export default authSeller;
