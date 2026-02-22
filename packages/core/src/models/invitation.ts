/**
 * Invitation link format & parsing.
 *
 * An invitation link contains the server address, document id, and a
 * one-shot token. The token is placed in the URL fragment (`#`) so it
 * is never transmitted to the server, preserving zero-knowledge.
 *
 * Format: `https://server.example.com/join#documentId/token`
 *
 * @see SPECIFICATIONS.md §4.4 — Joining a document
 */

import { type DocumentId, createDocumentId } from "./device";
import { type ServerAddress, isValidServerAddress } from "./document";

// ---------------------------------------------------------------------------
// Branded type for invitation tokens
// ---------------------------------------------------------------------------

/** Opaque invitation token string. */
export type InvitationToken = string & { readonly __brand: "InvitationToken" };

// ---------------------------------------------------------------------------
// InvitationLink
// ---------------------------------------------------------------------------

/** Parsed invitation link with its three components. */
export interface InvitationLink {
  readonly serverAddress: ServerAddress;
  readonly documentId: DocumentId;
  readonly token: InvitationToken;
}

// ---------------------------------------------------------------------------
// Parse errors
// ---------------------------------------------------------------------------

/** Possible error codes returned by `parseInvitationLink`. */
export type InvitationParseErrorCode =
  | "INVALID_URL"
  | "MISSING_FRAGMENT"
  | "INVALID_FRAGMENT_FORMAT"
  | "MISSING_DOCUMENT_ID"
  | "MISSING_TOKEN"
  | "INVALID_SERVER_ADDRESS";

/** Error returned when an invitation link cannot be parsed. */
export interface InvitationParseError {
  readonly code: InvitationParseErrorCode;
  readonly message: string;
}

/** Discriminated result type for parsing. */
export type InvitationParseResult =
  | { readonly ok: true; readonly value: InvitationLink }
  | { readonly ok: false; readonly error: InvitationParseError };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Path used in invitation URLs. */
export const INVITATION_PATH = "/join";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Validates that a token is a non-empty string. */
export function isValidInvitationToken(
  token: string,
): token is InvitationToken {
  return typeof token === "string" && token.length > 0;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates an InvitationToken from a raw string.
 * @throws {Error} if the token is empty.
 */
export function createInvitationToken(token: string): InvitationToken {
  if (!isValidInvitationToken(token)) {
    throw new Error("Invitation token must be a non-empty string");
  }
  return token as InvitationToken;
}

// ---------------------------------------------------------------------------
// Link creation
// ---------------------------------------------------------------------------

/**
 * Creates an invitation URL string from its components.
 *
 * The token is placed in the URL fragment so it is never sent to the
 * server (zero-knowledge). Format: `{serverAddress}/join#{documentId}/{token}`
 *
 * @throws {Error} if any component is invalid
 */
export function createInvitationLink(
  serverAddress: string,
  documentId: string,
  token: string,
): string {
  if (!isValidServerAddress(serverAddress)) {
    throw new Error("Server address must be a non-empty string");
  }
  if (!documentId || typeof documentId !== "string") {
    throw new Error("Document ID must be a non-empty string");
  }
  if (!token || typeof token !== "string") {
    throw new Error("Token must be a non-empty string");
  }

  const base = serverAddress.endsWith("/")
    ? serverAddress.slice(0, -1)
    : serverAddress;

  return `${base}${INVITATION_PATH}#${encodeURIComponent(documentId)}/${encodeURIComponent(token)}`;
}

// ---------------------------------------------------------------------------
// Link parsing
// ---------------------------------------------------------------------------

/**
 * Parses an invitation URL string into its components.
 *
 * Returns a discriminated result: `{ ok: true, value }` on success,
 * `{ ok: false, error }` on failure.
 */
export function parseInvitationLink(url: string): InvitationParseResult {
  if (!url || typeof url !== "string") {
    return parseError("INVALID_URL", "URL must be a non-empty string");
  }

  // Find the fragment separator
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) {
    return parseError("MISSING_FRAGMENT", "URL must contain a fragment (#)");
  }

  const baseUrl = url.slice(0, hashIndex);
  const fragment = url.slice(hashIndex + 1);

  if (!fragment) {
    return parseError("MISSING_FRAGMENT", "URL fragment is empty");
  }

  // Extract server address: remove the /join path
  const joinIndex = baseUrl.lastIndexOf(INVITATION_PATH);
  if (joinIndex === -1) {
    return parseError(
      "INVALID_URL",
      `URL must contain the '${INVITATION_PATH}' path`,
    );
  }

  const serverAddress = baseUrl.slice(0, joinIndex);
  if (!isValidServerAddress(serverAddress)) {
    return parseError(
      "INVALID_SERVER_ADDRESS",
      "Server address must be a non-empty string",
    );
  }

  // Parse the fragment: documentId/token
  const slashIndex = fragment.indexOf("/");
  if (slashIndex === -1) {
    return parseError(
      "INVALID_FRAGMENT_FORMAT",
      "Fragment must contain documentId/token separated by '/'",
    );
  }

  const rawDocumentId = decodeURIComponent(fragment.slice(0, slashIndex));
  const rawToken = decodeURIComponent(fragment.slice(slashIndex + 1));

  if (!rawDocumentId) {
    return parseError("MISSING_DOCUMENT_ID", "Document ID is empty");
  }
  if (!rawToken) {
    return parseError("MISSING_TOKEN", "Token is empty");
  }

  return {
    ok: true,
    value: {
      serverAddress: serverAddress as ServerAddress,
      documentId: createDocumentId(rawDocumentId),
      token: rawToken as InvitationToken,
    },
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function parseError(
  code: InvitationParseErrorCode,
  message: string,
): InvitationParseResult {
  return { ok: false, error: { code, message } };
}
