import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRoleById, extractRoleFromMetadata } from "./roles";
import { hasAdminRole, ROLES } from "@/config/roles";

/**
 * Checks whether the given user ID has administrative privileges.
 * @param {string | null | undefined} userId
 * @returns {Promise<boolean>}
 */
export async function isAdmin(userId) {
  if (!userId) return false;
  const role = await getUserRoleById(userId);
  return hasAdminRole(role);
}

/**
 * Server guard for Server Actions and Server Components.
 * Throws or redirects if the current session is not an authenticated admin.
 *
 * @param {Object} [options]
 * @param {string} [options.redirectTo] - Path to redirect to on unauthorized access
 * @returns {Promise<{ userId: string, role: string }>}
 */
export async function requireAdmin(options = {}) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    if (options.redirectTo) {
      redirect(options.redirectTo);
    }
    throw new Error("Unauthorized: Authentication required.");
  }

  const role = extractRoleFromMetadata({ role: sessionClaims?.metadata?.role });

  if (!hasAdminRole(role)) {
    // If not in session claims, fall back to currentUser lookup
    const user = await currentUser();
    const verifiedRole = extractRoleFromMetadata(user?.publicMetadata);

    if (!hasAdminRole(verifiedRole)) {
      if (options.redirectTo) {
        redirect(options.redirectTo);
      }
      throw new Error("Forbidden: Admin privileges required.");
    }

    return { userId, role: verifiedRole };
  }

  return { userId, role };
}

/**
 * Server guard ensuring the requester is authenticated.
 * @returns {Promise<{ userId: string }>}
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Sign-in required.");
  }
  return { userId };
}

export default {
  isAdmin,
  requireAdmin,
  requireAuth,
};
