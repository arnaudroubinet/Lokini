import { describe, it, expect } from "vitest";
import {
  createInvitationLink,
  parseInvitationLink,
  createInvitationToken,
  isValidInvitationToken,
  INVITATION_PATH,
  type InvitationLink,
  type InvitationParseResult,
  type InvitationParseErrorCode,
} from "../../src/models/invitation";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const DEFAULT_SERVER = "https://lokini.example.com";
const DEFAULT_DOC_ID = "doc-abc-123";
const DEFAULT_TOKEN = "tok-xyz-789";

function validUrl(): string {
  return `${DEFAULT_SERVER}${INVITATION_PATH}#${DEFAULT_DOC_ID}/${DEFAULT_TOKEN}`;
}

function expectParseOk(result: InvitationParseResult): InvitationLink {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error("Expected ok result");
  return result.value;
}

function expectParseError(
  result: InvitationParseResult,
  code: InvitationParseErrorCode,
): void {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected error result");
  expect(result.error.code).toBe(code);
  expect(result.error.message).toBeTruthy();
}

// ===========================================================================
// isValidInvitationToken
// ===========================================================================

describe("isValidInvitationToken", () => {
  it("returns true for a non-empty string", () => {
    expect(isValidInvitationToken("some-token")).toBe(true);
  });

  it("returns false for an empty string", () => {
    expect(isValidInvitationToken("")).toBe(false);
  });

  it("returns false for a non-string value", () => {
    expect(isValidInvitationToken(42 as unknown as string)).toBe(false);
  });
});

// ===========================================================================
// createInvitationToken
// ===========================================================================

describe("createInvitationToken", () => {
  it("creates a token from a valid string", () => {
    const token = createInvitationToken("my-token");
    expect(token).toBe("my-token");
  });

  it("throws for an empty string", () => {
    expect(() => createInvitationToken("")).toThrow(
      "Invitation token must be a non-empty string",
    );
  });
});

// ===========================================================================
// createInvitationLink
// ===========================================================================

describe("createInvitationLink", () => {
  it("creates a well-formed URL with the /join path and fragment", () => {
    const url = createInvitationLink(
      DEFAULT_SERVER,
      DEFAULT_DOC_ID,
      DEFAULT_TOKEN,
    );
    expect(url).toBe(
      `${DEFAULT_SERVER}/join#${DEFAULT_DOC_ID}/${DEFAULT_TOKEN}`,
    );
  });

  it("strips trailing slash from server address", () => {
    const url = createInvitationLink(
      "https://server.com/",
      DEFAULT_DOC_ID,
      DEFAULT_TOKEN,
    );
    expect(url).toBe(
      `https://server.com/join#${DEFAULT_DOC_ID}/${DEFAULT_TOKEN}`,
    );
  });

  it("supports self-hosted servers with custom ports", () => {
    const url = createInvitationLink(
      "https://my-server.local:8443",
      DEFAULT_DOC_ID,
      DEFAULT_TOKEN,
    );
    expect(url).toContain("my-server.local:8443/join#");
  });

  it("supports self-hosted servers with sub-paths", () => {
    const url = createInvitationLink(
      "https://example.com/lokini",
      DEFAULT_DOC_ID,
      DEFAULT_TOKEN,
    );
    expect(url).toBe(
      `https://example.com/lokini/join#${DEFAULT_DOC_ID}/${DEFAULT_TOKEN}`,
    );
  });

  it("places the token in the fragment (not query or path)", () => {
    const url = createInvitationLink(
      DEFAULT_SERVER,
      DEFAULT_DOC_ID,
      DEFAULT_TOKEN,
    );
    // Fragment starts after #
    const [baseUrl, fragment] = url.split("#");
    expect(baseUrl).not.toContain(DEFAULT_TOKEN);
    expect(fragment).toContain(DEFAULT_TOKEN);
    // No query string with the token
    expect(baseUrl).not.toContain("?");
  });

  it("URL-encodes special characters in document ID", () => {
    const url = createInvitationLink(
      DEFAULT_SERVER,
      "doc/with spaces&special",
      DEFAULT_TOKEN,
    );
    expect(url).not.toContain("doc/with spaces&special");
    expect(url).toContain(encodeURIComponent("doc/with spaces&special"));
  });

  it("URL-encodes special characters in token", () => {
    const url = createInvitationLink(
      DEFAULT_SERVER,
      DEFAULT_DOC_ID,
      "token/with#special",
    );
    expect(url).toContain(encodeURIComponent("token/with#special"));
  });

  it("throws for an empty server address", () => {
    expect(() =>
      createInvitationLink("", DEFAULT_DOC_ID, DEFAULT_TOKEN),
    ).toThrow("Server address must be a non-empty string");
  });

  it("throws for an empty document ID", () => {
    expect(() =>
      createInvitationLink(DEFAULT_SERVER, "", DEFAULT_TOKEN),
    ).toThrow("Document ID must be a non-empty string");
  });

  it("throws for an empty token", () => {
    expect(() =>
      createInvitationLink(DEFAULT_SERVER, DEFAULT_DOC_ID, ""),
    ).toThrow("Token must be a non-empty string");
  });
});

// ===========================================================================
// parseInvitationLink
// ===========================================================================

describe("parseInvitationLink", () => {
  // -------------------------------------------------------------------------
  // Successful parsing
  // -------------------------------------------------------------------------

  describe("valid links", () => {
    it("parses a standard invitation link", () => {
      const result = parseInvitationLink(validUrl());
      const link = expectParseOk(result);
      expect(link.serverAddress).toBe(DEFAULT_SERVER);
      expect(link.documentId).toBe(DEFAULT_DOC_ID);
      expect(link.token).toBe(DEFAULT_TOKEN);
    });

    it("round-trips with createInvitationLink", () => {
      const url = createInvitationLink(
        DEFAULT_SERVER,
        DEFAULT_DOC_ID,
        DEFAULT_TOKEN,
      );
      const result = parseInvitationLink(url);
      const link = expectParseOk(result);
      expect(link.serverAddress).toBe(DEFAULT_SERVER);
      expect(link.documentId).toBe(DEFAULT_DOC_ID);
      expect(link.token).toBe(DEFAULT_TOKEN);
    });

    it("parses a link with a self-hosted server (custom port)", () => {
      const url = createInvitationLink(
        "https://my-server.local:9090",
        DEFAULT_DOC_ID,
        DEFAULT_TOKEN,
      );
      const result = parseInvitationLink(url);
      const link = expectParseOk(result);
      expect(link.serverAddress).toBe("https://my-server.local:9090");
    });

    it("parses a link with a sub-path server", () => {
      const server = "https://example.com/lokini";
      const url = createInvitationLink(server, DEFAULT_DOC_ID, DEFAULT_TOKEN);
      const result = parseInvitationLink(url);
      const link = expectParseOk(result);
      expect(link.serverAddress).toBe(server);
    });

    it("decodes URL-encoded document ID", () => {
      const docId = "doc/with spaces&special";
      const url = createInvitationLink(DEFAULT_SERVER, docId, DEFAULT_TOKEN);
      const result = parseInvitationLink(url);
      const link = expectParseOk(result);
      expect(link.documentId).toBe(docId);
    });

    it("decodes URL-encoded token", () => {
      const token = "token/with#special";
      const url = createInvitationLink(DEFAULT_SERVER, DEFAULT_DOC_ID, token);
      const result = parseInvitationLink(url);
      const link = expectParseOk(result);
      expect(link.token).toBe(token);
    });

    it("parses HTTP URLs (non-HTTPS)", () => {
      const url = createInvitationLink(
        "http://localhost:3000",
        DEFAULT_DOC_ID,
        DEFAULT_TOKEN,
      );
      const result = parseInvitationLink(url);
      const link = expectParseOk(result);
      expect(link.serverAddress).toBe("http://localhost:3000");
    });
  });

  // -------------------------------------------------------------------------
  // Rejected malformed links
  // -------------------------------------------------------------------------

  describe("malformed links", () => {
    it("rejects an empty string", () => {
      expectParseError(parseInvitationLink(""), "INVALID_URL");
    });

    it("rejects a non-string value", () => {
      expectParseError(
        parseInvitationLink(null as unknown as string),
        "INVALID_URL",
      );
    });

    it("rejects a URL without a fragment", () => {
      expectParseError(
        parseInvitationLink(`${DEFAULT_SERVER}/join`),
        "MISSING_FRAGMENT",
      );
    });

    it("rejects a URL with an empty fragment", () => {
      expectParseError(
        parseInvitationLink(`${DEFAULT_SERVER}/join#`),
        "MISSING_FRAGMENT",
      );
    });

    it("rejects a URL without the /join path", () => {
      expectParseError(
        parseInvitationLink(
          `${DEFAULT_SERVER}#${DEFAULT_DOC_ID}/${DEFAULT_TOKEN}`,
        ),
        "INVALID_URL",
      );
    });

    it("rejects a fragment without a slash separator", () => {
      expectParseError(
        parseInvitationLink(`${DEFAULT_SERVER}/join#no-slash-here`),
        "INVALID_FRAGMENT_FORMAT",
      );
    });

    it("rejects a fragment with an empty document ID", () => {
      expectParseError(
        parseInvitationLink(`${DEFAULT_SERVER}/join#/${DEFAULT_TOKEN}`),
        "MISSING_DOCUMENT_ID",
      );
    });

    it("rejects a fragment with an empty token", () => {
      expectParseError(
        parseInvitationLink(`${DEFAULT_SERVER}/join#${DEFAULT_DOC_ID}/`),
        "MISSING_TOKEN",
      );
    });

    it("rejects a URL with an empty server address before /join", () => {
      expectParseError(
        parseInvitationLink(`/join#${DEFAULT_DOC_ID}/${DEFAULT_TOKEN}`),
        "INVALID_SERVER_ADDRESS",
      );
    });
  });

  // -------------------------------------------------------------------------
  // Security: token never in path or query
  // -------------------------------------------------------------------------

  describe("security", () => {
    it("ensures the token is only in the fragment", () => {
      const url = createInvitationLink(
        DEFAULT_SERVER,
        DEFAULT_DOC_ID,
        DEFAULT_TOKEN,
      );
      const hashIndex = url.indexOf("#");
      const baseUrl = url.slice(0, hashIndex);
      const fragment = url.slice(hashIndex + 1);

      // Token must NOT appear in the base URL (path, query, etc.)
      expect(baseUrl).not.toContain(DEFAULT_TOKEN);
      // Token MUST appear in the fragment
      expect(fragment).toContain(DEFAULT_TOKEN);
    });

    it("ensures the document ID is only in the fragment", () => {
      const url = createInvitationLink(
        DEFAULT_SERVER,
        DEFAULT_DOC_ID,
        DEFAULT_TOKEN,
      );
      const hashIndex = url.indexOf("#");
      const baseUrl = url.slice(0, hashIndex);

      // The base URL path is /join — the doc ID should not be in the path
      expect(baseUrl.endsWith("/join")).toBe(true);
    });
  });
});

// ===========================================================================
// INVITATION_PATH constant
// ===========================================================================

describe("INVITATION_PATH", () => {
  it("equals /join", () => {
    expect(INVITATION_PATH).toBe("/join");
  });
});
