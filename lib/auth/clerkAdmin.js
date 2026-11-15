import { clerkClient } from "@clerk/nextjs/server";
import { ROLES, DEFAULT_ROLE, isValidRole } from "@/config/roles";

/**
 * Updates a user's role in Clerk publicMetadata.
 * Note: Only callable on the server using CLERK_SECRET_KEY.
 *
 * @param {string} userId - The Clerk user ID
 * @param {'admin' | 'customer' | 'seller'} role - The target role
 * @returns {Promise<{ success: boolean, role: string, userId: string }>}
 */
export async function setUserRole(userId, role) {
  if (!userId) {
    throw new Error("Missing userId for role assignment.");
  }

  const normalizedRole = String(role).toLowerCase();
  if (!isValidRole(normalizedRole)) {
    throw new Error(
      `Invalid role '${role}'. Must be one of: ${Object.values(ROLES).join(", ")}`
    );
  }

  const client = await clerkClient();

  const user = await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: normalizedRole,
    },
  });

  return {
    success: true,
    userId: user.id,
    role: user.publicMetadata?.role || normalizedRole,
  };
}

/**
 * Promotes a user to the Admin role.
 * @param {string} userId
 */
export async function promoteToAdmin(userId) {
  return setUserRole(userId, ROLES.ADMIN);
}

/**
 * Demotes or resets a user to the Customer role.
 * @param {string} userId
 */
export async function demoteToCustomer(userId) {
  return setUserRole(userId, ROLES.CUSTOMER);
}

/**
 * Ensures user has an initialized role in publicMetadata (defaults to customer if not set).
 * @param {string} userId
 */
export async function ensureDefaultRole(userId) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user.publicMetadata?.role) {
    return setUserRole(userId, DEFAULT_ROLE);
  }

  return {
    success: true,
    userId: user.id,
    role: user.publicMetadata.role,
  };
}

export default {
  setUserRole,
  promoteToAdmin,
  demoteToCustomer,
  ensureDefaultRole,
};
