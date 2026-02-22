/**
 * Device identity model — per-document key pair.
 *
 * A device generates a private/public key pair for each document it joins.
 * There is no global cryptographic identity for a device; identity is
 * scoped to each document.
 *
 * @see SPECIFICATIONS.md §4.2 — Identity
 * @see SPECIFICATIONS.md §6.2 — Cryptographic choices (X25519, Ed25519)
 * @see SPECIFICATIONS.md §6.6 — Key exchange and joining
 */

// ---------------------------------------------------------------------------
// Branded types (nominal typing via TypeScript branding)
// ---------------------------------------------------------------------------

/** Opaque device identifier, unique per document participation. */
export type DeviceId = string & { readonly __brand: "DeviceId" };

/** Opaque document identifier. */
export type DocumentId = string & { readonly __brand: "DocumentId" };

// ---------------------------------------------------------------------------
// Key types (raw bytes represented as Uint8Array)
// ---------------------------------------------------------------------------

/** X25519 key pair used for key exchange (Diffie-Hellman). */
export interface X25519KeyPair {
  readonly publicKey: Uint8Array;
  readonly privateKey: Uint8Array;
}

/** Ed25519 key pair used for digital signatures. */
export interface Ed25519KeyPair {
  readonly publicKey: Uint8Array;
  readonly privateKey: Uint8Array;
}

/**
 * Complete cryptographic key pair for a device within a document.
 * Contains both key exchange (X25519) and signing (Ed25519) keys.
 */
export interface DeviceKeyPair {
  /** Key pair for Diffie-Hellman key exchange. */
  readonly x25519: X25519KeyPair;
  /** Key pair for digital signatures. */
  readonly ed25519: Ed25519KeyPair;
}

/**
 * Ephemeral X25519 key pair used during the joining protocol (§6.6).
 * These keys are generated for a single key exchange and discarded afterward.
 */
export interface EphemeralKeyPair {
  readonly publicKey: Uint8Array;
  readonly privateKey: Uint8Array;
}

// ---------------------------------------------------------------------------
// Device identity (per-document)
// ---------------------------------------------------------------------------

/**
 * Identity of a device within a specific document.
 *
 * Each device generates a unique identity for every document it participates in.
 * This ensures cryptographic isolation between documents.
 */
export interface DeviceIdentity {
  /** Unique identifier for this device within the document. */
  readonly id: DeviceId;
  /** The document this identity belongs to. */
  readonly documentId: DocumentId;
  /** Long-term cryptographic key pair for this document participation. */
  readonly keyPair: DeviceKeyPair;
  /** Optional pseudonym override for this specific document. */
  readonly documentPseudonym?: string;
}

// ---------------------------------------------------------------------------
// Device secret (reference type — implemented in T071)
// ---------------------------------------------------------------------------

/**
 * Secret used for at-rest encryption of local data via Argon2id.
 * This is a reference/placeholder type; full implementation is in T071.
 */
export type DeviceSecret = Uint8Array & { readonly __brand: "DeviceSecret" };

// ---------------------------------------------------------------------------
// Device profile (global, across all documents)
// ---------------------------------------------------------------------------

/**
 * Global device profile containing the user's default pseudonym.
 * A device has one profile and multiple identities (one per document).
 */
export interface DeviceProfile {
  /** Global pseudonym used by default in all documents. */
  readonly globalPseudonym?: string;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const DEVICE_ID_MIN_LENGTH = 1;
const X25519_PUBLIC_KEY_LENGTH = 32;
const X25519_PRIVATE_KEY_LENGTH = 32;
const ED25519_PUBLIC_KEY_LENGTH = 32;
const ED25519_PRIVATE_KEY_LENGTH = 64;

/** Validates that a DeviceId is non-empty. */
export function isValidDeviceId(id: string): id is DeviceId {
  return typeof id === "string" && id.length >= DEVICE_ID_MIN_LENGTH;
}

/** Validates that a DocumentId is non-empty. */
export function isValidDocumentId(id: string): id is DocumentId {
  return typeof id === "string" && id.length >= DEVICE_ID_MIN_LENGTH;
}

/** Validates an X25519 key pair has correct key lengths. */
export function isValidX25519KeyPair(keyPair: X25519KeyPair): boolean {
  return (
    keyPair.publicKey instanceof Uint8Array &&
    keyPair.privateKey instanceof Uint8Array &&
    keyPair.publicKey.length === X25519_PUBLIC_KEY_LENGTH &&
    keyPair.privateKey.length === X25519_PRIVATE_KEY_LENGTH
  );
}

/** Validates an Ed25519 key pair has correct key lengths. */
export function isValidEd25519KeyPair(keyPair: Ed25519KeyPair): boolean {
  return (
    keyPair.publicKey instanceof Uint8Array &&
    keyPair.privateKey instanceof Uint8Array &&
    keyPair.publicKey.length === ED25519_PUBLIC_KEY_LENGTH &&
    keyPair.privateKey.length === ED25519_PRIVATE_KEY_LENGTH
  );
}

/** Validates a complete DeviceKeyPair. */
export function isValidDeviceKeyPair(keyPair: DeviceKeyPair): boolean {
  return isValidX25519KeyPair(keyPair.x25519) && isValidEd25519KeyPair(keyPair.ed25519);
}

/** Validates a DeviceIdentity has valid fields. */
export function isValidDeviceIdentity(identity: DeviceIdentity): boolean {
  return (
    isValidDeviceId(identity.id) &&
    isValidDocumentId(identity.documentId) &&
    isValidDeviceKeyPair(identity.keyPair)
  );
}

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

/**
 * Creates a DeviceId from a raw string.
 * @throws {Error} if the id is empty.
 */
export function createDeviceId(id: string): DeviceId {
  if (!isValidDeviceId(id)) {
    throw new Error("DeviceId must be a non-empty string");
  }
  return id as DeviceId;
}

/**
 * Creates a DocumentId from a raw string.
 * @throws {Error} if the id is empty.
 */
export function createDocumentId(id: string): DocumentId {
  if (!isValidDocumentId(id)) {
    throw new Error("DocumentId must be a non-empty string");
  }
  return id as DocumentId;
}

/**
 * Creates a DeviceIdentity for a given document.
 *
 * @param id - Unique device identifier for this document
 * @param documentId - The document this identity belongs to
 * @param keyPair - Cryptographic key pair (X25519 + Ed25519)
 * @param documentPseudonym - Optional pseudonym override for this document
 * @throws {Error} if any parameter is invalid
 */
export function createDeviceIdentity(
  id: DeviceId,
  documentId: DocumentId,
  keyPair: DeviceKeyPair,
  documentPseudonym?: string,
): DeviceIdentity {
  if (!isValidDeviceId(id)) {
    throw new Error("DeviceId must be a non-empty string");
  }
  if (!isValidDocumentId(documentId)) {
    throw new Error("DocumentId must be a non-empty string");
  }
  if (!isValidDeviceKeyPair(keyPair)) {
    throw new Error("Invalid DeviceKeyPair: keys must have correct lengths");
  }

  return {
    id,
    documentId,
    keyPair,
    ...(documentPseudonym !== undefined ? { documentPseudonym } : {}),
  };
}

/**
 * Resolves the display name for a device in a specific document context.
 *
 * Priority:
 * 1. Document-specific pseudonym (if set)
 * 2. Global pseudonym (if set)
 * 3. undefined (no display name available)
 */
export function resolveDisplayName(
  identity: DeviceIdentity,
  profile: DeviceProfile,
): string | undefined {
  return identity.documentPseudonym ?? profile.globalPseudonym;
}
