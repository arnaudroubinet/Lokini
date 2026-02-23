/**
 * Key generation and exchange — X25519 (ECDH on Curve25519).
 *
 * Provides key pair generation and Diffie-Hellman shared secret computation
 * for the document join handshake and chain key distribution.
 *
 * @see SPECIFICATIONS.md §6.2 — Cryptographic choices (X25519 ECDH)
 * @see SPECIFICATIONS.md §6.6 — Key exchange and joining
 */

import type { X25519KeyPair } from "../models/device";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** X25519 public key length in bytes. */
export const X25519_PUBLIC_KEY_LENGTH = 32;

/** X25519 private key length in bytes. */
export const X25519_PRIVATE_KEY_LENGTH = 32;

/** Shared secret length in bytes (output of X25519 scalar multiplication). */
export const SHARED_SECRET_LENGTH = 32;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shared secret produced by X25519 Diffie-Hellman key exchange. */
export type SharedSecret = Uint8Array & { readonly __brand: "SharedSecret" };

// ---------------------------------------------------------------------------
// Functions (signatures — implementation in step 4)
// ---------------------------------------------------------------------------

/**
 * Generates a new random X25519 key pair for key exchange.
 *
 * Uses libsodium's crypto_box_keypair for secure random generation.
 *
 * @returns A new X25519 key pair with 32-byte public and private keys.
 */
export async function generateX25519KeyPair(): Promise<X25519KeyPair> {
  // Implementation in step 4
  throw new Error("Not implemented");
}

/**
 * Computes a shared secret from a local private key and a remote public key
 * using X25519 Diffie-Hellman key exchange.
 *
 * The resulting shared secret is identical regardless of which side computes
 * it (DH commutative property): computeSharedSecret(a.priv, b.pub) ===
 * computeSharedSecret(b.priv, a.pub).
 *
 * @param myPrivateKey   Local X25519 private key (32 bytes).
 * @param theirPublicKey Remote X25519 public key (32 bytes).
 * @returns 32-byte shared secret.
 * @throws If either key has invalid length.
 */
export async function computeSharedSecret(
  myPrivateKey: Uint8Array,
  theirPublicKey: Uint8Array,
): Promise<SharedSecret> {
  // Implementation in step 4
  throw new Error("Not implemented");
}
