import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { ROLES, DEFAULT_ROLE, hasAdminRole, isValidRole } from "@/config/roles";

/**
 * Extracts and normalizes role from Clerk publicMetadata.
 * @param {Record<string, any> | undefined | null} metadata
 * @returns {string} Normalized role ('admin' | 'customer' | 'seller')
 */
export function extractRoleFromMetadata(metadata) {
  if (!metadata || !metadata.role) {
    return DEFAULT_ROLE;
  }

  const role = String(metadata.role).toLowerCase();
  return isValidRole(role) ? role : DEFAULT_ROLE;
}

/**
 * Retrieves the current authenticated user's role from session JWT claims.
 * Fast, zero-network call.
 * @returns {Promise<{ userId: string | null, role: string, isAdmin: boolean }>}
 */
export async function getSessionRole() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { userId: null, role: DEFAULT_ROLE, isAdmin: false };
  }

  const rawRole = sessionClaims?.metadata?.role;
  const role = extractRoleFromMetadata({ role: rawRole });

  return {
    userId,
    role,
    isAdmin: hasAdminRole(role),
  };
}

/**
 * Retrieves the current authenticated user's full role from currentUser() object.
 * @returns {Promise<{ userId: string | null, role: string, isAdmin: boolean }>}
 */
export async function getCurrentUserRole() {
  const user = await currentUser();

  if (!user) {
    return { userId: null, role: DEFAULT_ROLE, isAdmin: false };
  }

  const role = extractRoleFromMetadata(user.publicMetadata);

  return {
    userId: user.id,
    role,
    isAdmin: hasAdminRole(role),
  };
}

/**
 * Fetches a specific user's role via Clerk Backend API by userId.
 * @param {string} userId
 * @returns {Promise<string>}
 */
export async function getUserRoleById(userId) {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return extractRoleFromMetadata(user?.publicMetadata);
  } catch (error) {
    console.error(`Failed to fetch role for user ${userId}:`, error?.message || error);
    return DEFAULT_ROLE;
  }
}

export default {
  extractRoleFromMetadata,
  getSessionRole,
  getCurrentUserRole,
  getUserRoleById,
};
