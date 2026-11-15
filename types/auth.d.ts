/**
 * Clerk Authentication and Session Claims Type Augmentations
 */

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: 'admin' | 'customer' | 'seller';
    };
  }

  interface UserPublicMetadata {
    role?: 'admin' | 'customer' | 'seller';
  }
}
