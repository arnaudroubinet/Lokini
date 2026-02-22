/**
 * Key derivation — HKDF-SHA256 (RFC 5869).
 *
 * Derives sub-keys (encryption, signature, storage) from shared secrets
 * using the Extract-then-Expand paradigm with HMAC-SHA256.
 *
 * All HMAC-SHA256 operations are delegated to libsodium, which provides
 * a constant-time, audited implementation. Sensitive intermediate values
 * (PRK, previous T blocks) are wiped from memory after use.
 *
 * @see SPECIFICATIONS.md §6.2 — Cryptographic choices (HKDF-SHA256)
 * @see SPECIFICATIONS.md §6.3 — Key management (message key derivation)
 * @see RFC 5869 — HMAC-based Extract-and-Expand Key Derivation Function
 */

import sodium from "libsodium-wrappers-sumo";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** HMAC-SHA256 output length in bytes. */
export const HKDF_HASH_LENGTH = 32;

/** Maximum output length for HKDF-Expand: 255 * HashLen. */
export const HKDF_MAX_OUTPUT_LENGTH = 255 * HKDF_HASH_LENGTH;

// ---------------------------------------------------------------------------
// HKDF Extract
// ---------------------------------------------------------------------------

/**
 * HKDF-Extract (RFC 5869 §2.2).
 *
 * Extracts a fixed-length pseudorandom key (PRK) from input keying
 * material and an optional salt using HMAC-SHA256.
 *
 * @param ikm  Input keying material (arbitrary length, non-empty).
 * @param salt Optional salt (arbitrary length). Defaults to HashLen zeros.
 * @returns    32-byte pseudorandom key (PRK).
 * @throws     If ikm is empty.
 */
export async function hkdfExtract(
  ikm: Uint8Array,
  salt?: Uint8Array,
): Promise<Uint8Array> {
  await sodium.ready;

  if (!(ikm instanceof Uint8Array) || ikm.length === 0) {
    throw new Error("IKM must be a non-empty Uint8Array");
  }

  const effectiveSalt =
    salt && salt.length > 0 ? salt : new Uint8Array(HKDF_HASH_LENGTH);

  return new Uint8Array(hmacSha256(effectiveSalt, ikm));
}

// ---------------------------------------------------------------------------
// HKDF Expand
// ---------------------------------------------------------------------------

/**
 * HKDF-Expand (RFC 5869 §2.3).
 *
 * Expands a pseudorandom key into output keying material of the
 * desired length using HMAC-SHA256 with a context/info string.
 *
 * @param prk    Pseudorandom key (at least HashLen bytes).
 * @param info   Context and application-specific info (can be empty).
 * @param length Desired output length in bytes (1..8160).
 * @returns      Output keying material of the requested length.
 * @throws       If prk is too short or length is out of range.
 */
export async function hkdfExpand(
  prk: Uint8Array,
  info: Uint8Array,
  length: number,
): Promise<Uint8Array> {
  await sodium.ready;

  if (!(prk instanceof Uint8Array) || prk.length < HKDF_HASH_LENGTH) {
    throw new Error(
      `PRK must be at least ${HKDF_HASH_LENGTH} bytes, got ${prk instanceof Uint8Array ? prk.length : "invalid"}`,
    );
  }

  if (
    !Number.isInteger(length) ||
    length < 1 ||
    length > HKDF_MAX_OUTPUT_LENGTH
  ) {
    throw new Error(
      `Output length must be between 1 and ${HKDF_MAX_OUTPUT_LENGTH}, got ${length}`,
    );
  }

  const n = Math.ceil(length / HKDF_HASH_LENGTH);
  const okm = new Uint8Array(n * HKDF_HASH_LENGTH);
  let prev: Uint8Array = new Uint8Array(0);

  for (let i = 1; i <= n; i++) {
    const input = new Uint8Array(prev.length + info.length + 1);
    input.set(prev, 0);
    input.set(info, prev.length);
    input[prev.length + info.length] = i;

    // Wipe previous T block before overwriting
    if (prev.length > 0) {
      sodium.memzero(prev);
    }

    prev = new Uint8Array(hmacSha256(prk, input));
    okm.set(prev, (i - 1) * HKDF_HASH_LENGTH);

    // Wipe HMAC input
    sodium.memzero(input);
  }

  // Wipe last T block
  sodium.memzero(prev);

  return okm.slice(0, length);
}

// ---------------------------------------------------------------------------
// HKDF Derive (combined Extract + Expand)
// ---------------------------------------------------------------------------

/**
 * Full HKDF key derivation: Extract then Expand.
 *
 * Derives a sub-key of the desired length from input keying material,
 * an optional salt, and an info context string.
 *
 * @param ikm    Input keying material (arbitrary length, non-empty).
 * @param salt   Optional salt (arbitrary length).
 * @param info   Context string for domain separation (e.g. "encryption").
 * @param length Desired output length in bytes (1..8160).
 * @returns      Derived key of the requested length.
 */
export async function hkdfDerive(
  ikm: Uint8Array,
  salt: Uint8Array | undefined,
  info: Uint8Array,
  length: number,
): Promise<Uint8Array> {
  const prk = await hkdfExtract(ikm, salt);
  try {
    return await hkdfExpand(prk, info, length);
  } finally {
    // Wipe the intermediate PRK
    sodium.memzero(prk);
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Computes HMAC-SHA256(key, message) using libsodium streaming API
 * to support arbitrary key lengths.
 */
function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
  const state = sodium.crypto_auth_hmacsha256_init(key);
  sodium.crypto_auth_hmacsha256_update(state, message);
  return sodium.crypto_auth_hmacsha256_final(state);
}
