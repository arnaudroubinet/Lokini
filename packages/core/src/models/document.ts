/**
 * Base document model — common properties for all document types.
 *
 * A document is the central unit in Lokini. It is shared between a set of
 * devices. Each device participating can modify the document. There is no
 * distinction between multi-device sync and multi-user sharing.
 *
 * @see SPECIFICATIONS.md §4.1 — Unified model
 * @see SPECIFICATIONS.md §4.3 — Document creation
 * @see SPECIFICATIONS.md §5.0 — Common properties
 * @see SPECIFICATIONS.md §5.1 — Initial document types
 */

import { type DeviceId, type DocumentId, createDocumentId } from "./device";

// ---------------------------------------------------------------------------
// Document type discriminator
// ---------------------------------------------------------------------------

/**
 * Supported document types.
 * Extensible by developers in application releases (not user-defined).
 */
export type DocumentType = "note" | "todo" | "shopping-list";

// ---------------------------------------------------------------------------
// Server address
// ---------------------------------------------------------------------------

/** Server URL hosting the document. Opaque string (URL format). */
export type ServerAddress = string & { readonly __brand: "ServerAddress" };

// ---------------------------------------------------------------------------
// Participant
// ---------------------------------------------------------------------------

/**
 * A participant in a document.
 * Represents a device that has joined the document with its public identity.
 */
export interface Participant {
  /** Device identifier within this document. */
  readonly deviceId: DeviceId;
  /** Encrypted pseudonym (only decryptable by other participants). */
  readonly encryptedPseudonym?: Uint8Array;
  /** Public key (X25519) for key exchange with this participant. */
  readonly publicKey: Uint8Array;
}

// ---------------------------------------------------------------------------
// Document metadata
// ---------------------------------------------------------------------------

/**
 * Complete metadata for a document.
 * Title, type, participants, server, and configuration.
 */
export interface DocumentMetadata {
  /** Unique document identifier. */
  readonly id: DocumentId;
  /** Document type discriminator. */
  readonly type: DocumentType;
  /** Document title (auto-generated if not provided). */
  readonly title: string;
  /** Timestamp of document creation (ISO 8601). */
  readonly createdAt: string;
  /** Server hosting this document. */
  readonly server: ServerAddress;
  /** List of participating devices. */
  readonly participants: readonly Participant[];
  /** Maximum number of devices allowed (default: 40). */
  readonly maxDevices: number;
}

// ---------------------------------------------------------------------------
// Document configuration
// ---------------------------------------------------------------------------

/** Default maximum number of devices per document (§4.1). */
export const DEFAULT_MAX_DEVICES = 40;

/** Valid document types for validation. */
export const VALID_DOCUMENT_TYPES: readonly DocumentType[] = [
  "note",
  "todo",
  "shopping-list",
];

/** X25519 public key length in bytes. */
const X25519_PUBLIC_KEY_LENGTH = 32;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Validates that a value is a supported document type. */
export function isValidDocumentType(type: string): type is DocumentType {
  return VALID_DOCUMENT_TYPES.includes(type as DocumentType);
}

/** Validates a server address (non-empty string). */
export function isValidServerAddress(
  address: string,
): address is ServerAddress {
  return typeof address === "string" && address.length > 0;
}

/** Validates a participant has correct fields. */
export function isValidParticipant(participant: Participant): boolean {
  return (
    typeof participant.deviceId === "string" &&
    participant.deviceId.length > 0 &&
    participant.publicKey instanceof Uint8Array &&
    participant.publicKey.length === X25519_PUBLIC_KEY_LENGTH
  );
}

/** Validates that maxDevices is a positive integer. */
export function isValidMaxDevices(maxDevices: number): boolean {
  return Number.isInteger(maxDevices) && maxDevices > 0;
}

/** Validates a complete DocumentMetadata object. */
export function isValidDocumentMetadata(doc: DocumentMetadata): boolean {
  return (
    typeof doc.id === "string" &&
    doc.id.length > 0 &&
    isValidDocumentType(doc.type) &&
    typeof doc.title === "string" &&
    doc.title.length > 0 &&
    typeof doc.createdAt === "string" &&
    doc.createdAt.length > 0 &&
    isValidServerAddress(doc.server as string) &&
    Array.isArray(doc.participants) &&
    doc.participants.every(isValidParticipant) &&
    isValidMaxDevices(doc.maxDevices)
  );
}

// ---------------------------------------------------------------------------
// Title generation
// ---------------------------------------------------------------------------

/**
 * Generates a default title based on document type and date.
 * Format: "Note du DD/MM/YYYY", "To-do du DD/MM/YYYY", etc.
 *
 * @see SPECIFICATIONS.md §5.0 — Auto-generated title
 */
export function generateDefaultTitle(type: DocumentType, date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  switch (type) {
    case "note":
      return `Note du ${formattedDate}`;
    case "todo":
      return `To-do du ${formattedDate}`;
    case "shopping-list":
      return `Liste de courses du ${formattedDate}`;
  }
}

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

/** Options for creating a new document. */
export interface CreateDocumentOptions {
  /** Document identifier. */
  id: string;
  /** Document type. */
  type: DocumentType;
  /** Server hosting the document. */
  server: string;
  /** Optional title (auto-generated if omitted). */
  title?: string;
  /** Optional creation date (defaults to now). */
  createdAt?: Date;
  /** Optional max devices override (default: 40). */
  maxDevices?: number;
}

/**
 * Creates a new DocumentMetadata with validated fields.
 *
 * @throws {Error} if any required field is invalid
 */
export function createDocument(options: CreateDocumentOptions): DocumentMetadata {
  const {
    id,
    type,
    server,
    title,
    createdAt = new Date(),
    maxDevices = DEFAULT_MAX_DEVICES,
  } = options;

  const documentId = createDocumentId(id);

  if (!isValidDocumentType(type)) {
    throw new Error(`Invalid document type: ${type}`);
  }
  if (!isValidServerAddress(server)) {
    throw new Error("Server address must be a non-empty string");
  }
  if (!isValidMaxDevices(maxDevices)) {
    throw new Error("maxDevices must be a positive integer");
  }

  const resolvedTitle = title ?? generateDefaultTitle(type, createdAt);

  return {
    id: documentId,
    type,
    title: resolvedTitle,
    createdAt: createdAt.toISOString(),
    server: server as ServerAddress,
    participants: [],
    maxDevices,
  };
}

/**
 * Creates a ServerAddress from a raw string.
 * @throws {Error} if the address is empty.
 */
export function createServerAddress(address: string): ServerAddress {
  if (!isValidServerAddress(address)) {
    throw new Error("ServerAddress must be a non-empty string");
  }
  return address as ServerAddress;
}

// ---------------------------------------------------------------------------
// Participant management
// ---------------------------------------------------------------------------

/**
 * Adds a participant to a document.
 * Returns a new DocumentMetadata with the participant added.
 *
 * @throws {Error} if the participant limit is reached
 * @throws {Error} if the participant is invalid
 * @throws {Error} if the device is already a participant
 */
export function addParticipant(
  document: DocumentMetadata,
  participant: Participant,
): DocumentMetadata {
  if (!isValidParticipant(participant)) {
    throw new Error("Invalid participant: deviceId and publicKey are required");
  }

  if (document.participants.length >= document.maxDevices) {
    throw new Error(
      `Cannot add participant: maximum of ${document.maxDevices} devices reached`,
    );
  }

  const alreadyExists = document.participants.some(
    (p) => p.deviceId === participant.deviceId,
  );
  if (alreadyExists) {
    throw new Error(
      `Device ${participant.deviceId} is already a participant`,
    );
  }

  return {
    ...document,
    participants: [...document.participants, participant],
  };
}

/**
 * Removes a participant from a document by device id.
 * Returns a new DocumentMetadata without the participant.
 *
 * @throws {Error} if the device is not a participant
 */
export function removeParticipant(
  document: DocumentMetadata,
  deviceId: DeviceId,
): DocumentMetadata {
  const index = document.participants.findIndex(
    (p) => p.deviceId === deviceId,
  );
  if (index === -1) {
    throw new Error(`Device ${deviceId} is not a participant`);
  }

  return {
    ...document,
    participants: document.participants.filter(
      (p) => p.deviceId !== deviceId,
    ),
  };
}
