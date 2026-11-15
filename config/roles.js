/**
 * Role-Based Access Control (RBAC) Configuration and Constants
 *
 * Defines the roles stored in Clerk user publicMetadata:
 * - 'admin': Store owner/manager with full access to /admin, inventory, and order operations
 * - 'customer': Default consumer role with access to storefront, cart, and my-orders
 * - 'seller': Backward-compatible alias for admin role
 */

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  SELLER: 'seller', // backward-compatible alias for admin
};

export const ADMIN_ROLES = [ROLES.ADMIN, ROLES.SELLER];

export const ALL_ROLES = [ROLES.ADMIN, ROLES.CUSTOMER, ROLES.SELLER];

export const DEFAULT_ROLE = ROLES.CUSTOMER;

/**
 * Checks if a given role string qualifies for administrative access.
 * @param {string | undefined | null} role
 * @returns {boolean}
 */
export function hasAdminRole(role) {
  if (!role) return false;
  return ADMIN_ROLES.includes(role.toLowerCase());
}

/**
 * Validates if the supplied role is recognized.
 * @param {string | undefined | null} role
 * @returns {boolean}
 */
export function isValidRole(role) {
  if (!role) return false;
  return ALL_ROLES.includes(role.toLowerCase());
}

export default {
  ROLES,
  ADMIN_ROLES,
  ALL_ROLES,
  DEFAULT_ROLE,
  hasAdminRole,
  isValidRole,
};
