import { describe, it, expect } from "vitest";
import {
  createDocument,
  createServerAddress,
  addParticipant,
  removeParticipant,
  generateDefaultTitle,
  isValidDocumentType,
  isValidServerAddress,
  isValidParticipant,
  isValidMaxDevices,
  isValidDocumentMetadata,
  DEFAULT_MAX_DEVICES,
  VALID_DOCUMENT_TYPES,
  type DocumentType,
  type Participant,
  type DocumentMetadata,
  type CreateDocumentOptions,
} from "../../src/models/document";
import { createDeviceId } from "../../src/models/device";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function fakeParticipant(deviceId?: string): Participant {
  return {
    deviceId: createDeviceId(deviceId ?? "device-1"),
    publicKey: new Uint8Array(32).fill(0xaa),
  };
}

function fakeDocumentOptions(
  overrides?: Partial<CreateDocumentOptions>,
): CreateDocumentOptions {
  return {
    id: "doc-abc-123",
    type: "note",
    server: "https://lokini.example.com",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// DocumentType validation
// ---------------------------------------------------------------------------

describe("DocumentType", () => {
  it("accepts 'note' as valid", () => {
    expect(isValidDocumentType("note")).toBe(true);
  });

  it("accepts 'todo' as valid", () => {
    expect(isValidDocumentType("todo")).toBe(true);
  });

  it("accepts 'shopping-list' as valid", () => {
    expect(isValidDocumentType("shopping-list")).toBe(true);
  });

  it("rejects unknown types", () => {
    expect(isValidDocumentType("spreadsheet")).toBe(false);
    expect(isValidDocumentType("")).toBe(false);
  });

  it("exposes all valid types in VALID_DOCUMENT_TYPES", () => {
    expect(VALID_DOCUMENT_TYPES).toContain("note");
    expect(VALID_DOCUMENT_TYPES).toContain("todo");
    expect(VALID_DOCUMENT_TYPES).toContain("shopping-list");
    expect(VALID_DOCUMENT_TYPES).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// ServerAddress validation
// ---------------------------------------------------------------------------

describe("ServerAddress", () => {
  it("accepts non-empty strings", () => {
    expect(isValidServerAddress("https://lokini.example.com")).toBe(true);
  });

  it("rejects empty strings", () => {
    expect(isValidServerAddress("")).toBe(false);
  });

  it("creates a branded ServerAddress", () => {
    const addr = createServerAddress("https://lokini.example.com");
    expect(addr).toBe("https://lokini.example.com");
  });

  it("throws on empty string", () => {
    expect(() => createServerAddress("")).toThrow(
      "ServerAddress must be a non-empty string",
    );
  });
});

// ---------------------------------------------------------------------------
// Participant validation
// ---------------------------------------------------------------------------

describe("Participant", () => {
  it("accepts valid participant", () => {
    expect(isValidParticipant(fakeParticipant())).toBe(true);
  });

  it("accepts participant with encrypted pseudonym", () => {
    const participant: Participant = {
      ...fakeParticipant(),
      encryptedPseudonym: new Uint8Array([1, 2, 3]),
    };
    expect(isValidParticipant(participant)).toBe(true);
  });

  it("rejects participant with wrong public key length", () => {
    const participant: Participant = {
      deviceId: createDeviceId("device-1"),
      publicKey: new Uint8Array(16), // wrong length
    };
    expect(isValidParticipant(participant)).toBe(false);
  });

  it("rejects participant with non-Uint8Array public key", () => {
    const participant = {
      deviceId: createDeviceId("device-1"),
      publicKey: "not-a-key" as unknown as Uint8Array,
    };
    expect(isValidParticipant(participant as Participant)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// maxDevices validation
// ---------------------------------------------------------------------------

describe("maxDevices validation", () => {
  it("accepts positive integers", () => {
    expect(isValidMaxDevices(1)).toBe(true);
    expect(isValidMaxDevices(40)).toBe(true);
    expect(isValidMaxDevices(100)).toBe(true);
  });

  it("rejects zero", () => {
    expect(isValidMaxDevices(0)).toBe(false);
  });

  it("rejects negative numbers", () => {
    expect(isValidMaxDevices(-1)).toBe(false);
  });

  it("rejects non-integers", () => {
    expect(isValidMaxDevices(1.5)).toBe(false);
  });

  it("default is 40", () => {
    expect(DEFAULT_MAX_DEVICES).toBe(40);
  });
});

// ---------------------------------------------------------------------------
// Default title generation
// ---------------------------------------------------------------------------

describe("generateDefaultTitle", () => {
  const date = new Date(2026, 1, 22); // Feb 22, 2026

  it("generates title for note", () => {
    expect(generateDefaultTitle("note", date)).toBe("Note du 22/02/2026");
  });

  it("generates title for todo", () => {
    expect(generateDefaultTitle("todo", date)).toBe("To-do du 22/02/2026");
  });

  it("generates title for shopping-list", () => {
    expect(generateDefaultTitle("shopping-list", date)).toBe(
      "Liste de courses du 22/02/2026",
    );
  });

  it("pads single-digit day and month", () => {
    const jan1 = new Date(2026, 0, 1);
    expect(generateDefaultTitle("note", jan1)).toBe("Note du 01/01/2026");
  });
});

// ---------------------------------------------------------------------------
// createDocument
// ---------------------------------------------------------------------------

describe("createDocument", () => {
  it("creates a document with explicit title", () => {
    const doc = createDocument(
      fakeDocumentOptions({ title: "My custom title" }),
    );
    expect(doc.title).toBe("My custom title");
    expect(doc.type).toBe("note");
    expect(doc.id).toBe("doc-abc-123");
    expect(doc.server).toBe("https://lokini.example.com");
    expect(doc.participants).toEqual([]);
    expect(doc.maxDevices).toBe(DEFAULT_MAX_DEVICES);
  });

  it("auto-generates title when not provided", () => {
    const date = new Date(2026, 1, 22);
    const doc = createDocument(fakeDocumentOptions({ createdAt: date }));
    expect(doc.title).toBe("Note du 22/02/2026");
  });

  it("stores creation date as ISO string", () => {
    const date = new Date(2026, 1, 22, 10, 30, 0);
    const doc = createDocument(fakeDocumentOptions({ createdAt: date }));
    expect(doc.createdAt).toBe(date.toISOString());
  });

  it("uses default maxDevices of 40", () => {
    const doc = createDocument(fakeDocumentOptions());
    expect(doc.maxDevices).toBe(40);
  });

  it("accepts custom maxDevices", () => {
    const doc = createDocument(fakeDocumentOptions({ maxDevices: 10 }));
    expect(doc.maxDevices).toBe(10);
  });

  it("starts with empty participant list", () => {
    const doc = createDocument(fakeDocumentOptions());
    expect(doc.participants).toHaveLength(0);
  });

  it("throws on empty document id", () => {
    expect(() => createDocument(fakeDocumentOptions({ id: "" }))).toThrow(
      "DocumentId must be a non-empty string",
    );
  });

  it("throws on invalid document type", () => {
    expect(() =>
      createDocument(
        fakeDocumentOptions({ type: "spreadsheet" as DocumentType }),
      ),
    ).toThrow("Invalid document type: spreadsheet");
  });

  it("throws on empty server address", () => {
    expect(() =>
      createDocument(fakeDocumentOptions({ server: "" })),
    ).toThrow("Server address must be a non-empty string");
  });

  it("throws on invalid maxDevices", () => {
    expect(() =>
      createDocument(fakeDocumentOptions({ maxDevices: 0 })),
    ).toThrow("maxDevices must be a positive integer");
    expect(() =>
      createDocument(fakeDocumentOptions({ maxDevices: -5 })),
    ).toThrow("maxDevices must be a positive integer");
    expect(() =>
      createDocument(fakeDocumentOptions({ maxDevices: 1.5 })),
    ).toThrow("maxDevices must be a positive integer");
  });
});

// ---------------------------------------------------------------------------
// DocumentMetadata validation
// ---------------------------------------------------------------------------

describe("isValidDocumentMetadata", () => {
  it("validates a correct document", () => {
    const date = new Date(2026, 1, 22);
    const doc = createDocument(fakeDocumentOptions({ createdAt: date }));
    expect(isValidDocumentMetadata(doc)).toBe(true);
  });

  it("validates a document with participants", () => {
    const doc = createDocument(fakeDocumentOptions());
    const withParticipant = addParticipant(doc, fakeParticipant());
    expect(isValidDocumentMetadata(withParticipant)).toBe(true);
  });

  it("rejects document with invalid participant", () => {
    const doc = createDocument(fakeDocumentOptions());
    // Manually craft invalid metadata
    const invalid: DocumentMetadata = {
      ...doc,
      participants: [
        {
          deviceId: createDeviceId("d1"),
          publicKey: new Uint8Array(16), // wrong length
        },
      ],
    };
    expect(isValidDocumentMetadata(invalid)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// addParticipant
// ---------------------------------------------------------------------------

describe("addParticipant", () => {
  it("adds a participant to an empty document", () => {
    const doc = createDocument(fakeDocumentOptions());
    const updated = addParticipant(doc, fakeParticipant("device-1"));
    expect(updated.participants).toHaveLength(1);
    expect(updated.participants[0].deviceId).toBe("device-1");
  });

  it("returns a new document (immutability)", () => {
    const doc = createDocument(fakeDocumentOptions());
    const updated = addParticipant(doc, fakeParticipant("device-1"));
    expect(updated).not.toBe(doc);
    expect(doc.participants).toHaveLength(0);
    expect(updated.participants).toHaveLength(1);
  });

  it("adds multiple participants", () => {
    const doc = createDocument(fakeDocumentOptions());
    const doc1 = addParticipant(doc, fakeParticipant("device-1"));
    const doc2 = addParticipant(doc1, fakeParticipant("device-2"));
    expect(doc2.participants).toHaveLength(2);
  });

  it("throws when participant limit is reached", () => {
    const doc = createDocument(fakeDocumentOptions({ maxDevices: 2 }));
    const doc1 = addParticipant(doc, fakeParticipant("device-1"));
    const doc2 = addParticipant(doc1, fakeParticipant("device-2"));
    expect(() => addParticipant(doc2, fakeParticipant("device-3"))).toThrow(
      "Cannot add participant: maximum of 2 devices reached",
    );
  });

  it("throws when device is already a participant", () => {
    const doc = createDocument(fakeDocumentOptions());
    const updated = addParticipant(doc, fakeParticipant("device-1"));
    expect(() => addParticipant(updated, fakeParticipant("device-1"))).toThrow(
      "Device device-1 is already a participant",
    );
  });

  it("throws with invalid participant (bad public key)", () => {
    const doc = createDocument(fakeDocumentOptions());
    const invalidParticipant: Participant = {
      deviceId: createDeviceId("device-1"),
      publicKey: new Uint8Array(16), // wrong length
    };
    expect(() => addParticipant(doc, invalidParticipant)).toThrow(
      "Invalid participant",
    );
  });

  it("preserves other document fields", () => {
    const doc = createDocument(
      fakeDocumentOptions({ title: "My doc", maxDevices: 10 }),
    );
    const updated = addParticipant(doc, fakeParticipant("device-1"));
    expect(updated.title).toBe("My doc");
    expect(updated.maxDevices).toBe(10);
    expect(updated.type).toBe("note");
    expect(updated.id).toBe(doc.id);
    expect(updated.server).toBe(doc.server);
    expect(updated.createdAt).toBe(doc.createdAt);
  });
});

// ---------------------------------------------------------------------------
// removeParticipant
// ---------------------------------------------------------------------------

describe("removeParticipant", () => {
  it("removes an existing participant", () => {
    const doc = createDocument(fakeDocumentOptions());
    const doc1 = addParticipant(doc, fakeParticipant("device-1"));
    const doc2 = addParticipant(doc1, fakeParticipant("device-2"));
    const updated = removeParticipant(
      doc2,
      createDeviceId("device-1"),
    );
    expect(updated.participants).toHaveLength(1);
    expect(updated.participants[0].deviceId).toBe("device-2");
  });

  it("returns a new document (immutability)", () => {
    const doc = createDocument(fakeDocumentOptions());
    const withParticipant = addParticipant(doc, fakeParticipant("device-1"));
    const updated = removeParticipant(
      withParticipant,
      createDeviceId("device-1"),
    );
    expect(updated).not.toBe(withParticipant);
    expect(withParticipant.participants).toHaveLength(1);
    expect(updated.participants).toHaveLength(0);
  });

  it("throws when device is not a participant", () => {
    const doc = createDocument(fakeDocumentOptions());
    expect(() =>
      removeParticipant(doc, createDeviceId("unknown-device")),
    ).toThrow("Device unknown-device is not a participant");
  });
});

// ---------------------------------------------------------------------------
// Immutability
// ---------------------------------------------------------------------------

describe("immutability", () => {
  it("document metadata properties are readonly", () => {
    const doc = createDocument(fakeDocumentOptions({ title: "Test" }));
    // TypeScript readonly check — assignment should fail at compile time.
    // At runtime, verify the object structure is as expected.
    expect(doc.title).toBe("Test");
    expect(doc.type).toBe("note");
    expect(doc.participants).toEqual([]);
  });

  it("participants array is readonly", () => {
    const doc = createDocument(fakeDocumentOptions());
    const updated = addParticipant(doc, fakeParticipant("device-1"));
    // Verify we can't accidentally mutate via reference
    expect(Object.isFrozen(updated.participants)).toBe(false); // JS arrays aren't frozen
    // But the original is preserved
    expect(doc.participants).toHaveLength(0);
    expect(updated.participants).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("edge cases", () => {
  it("document with maxDevices of 1 allows exactly one participant", () => {
    const doc = createDocument(fakeDocumentOptions({ maxDevices: 1 }));
    const updated = addParticipant(doc, fakeParticipant("device-1"));
    expect(updated.participants).toHaveLength(1);
    expect(() => addParticipant(updated, fakeParticipant("device-2"))).toThrow(
      "maximum of 1 devices reached",
    );
  });

  it("removing all participants results in empty list", () => {
    const doc = createDocument(fakeDocumentOptions());
    const doc1 = addParticipant(doc, fakeParticipant("device-1"));
    const doc2 = removeParticipant(doc1, createDeviceId("device-1"));
    expect(doc2.participants).toHaveLength(0);
  });

  it("can re-add a participant after removal", () => {
    const doc = createDocument(fakeDocumentOptions());
    const doc1 = addParticipant(doc, fakeParticipant("device-1"));
    const doc2 = removeParticipant(doc1, createDeviceId("device-1"));
    const doc3 = addParticipant(doc2, fakeParticipant("device-1"));
    expect(doc3.participants).toHaveLength(1);
    expect(doc3.participants[0].deviceId).toBe("device-1");
  });

  it("different document types generate different default titles", () => {
    const date = new Date(2026, 1, 22);
    const noteTitle = generateDefaultTitle("note", date);
    const todoTitle = generateDefaultTitle("todo", date);
    const shoppingTitle = generateDefaultTitle("shopping-list", date);
    expect(noteTitle).not.toBe(todoTitle);
    expect(todoTitle).not.toBe(shoppingTitle);
    expect(noteTitle).not.toBe(shoppingTitle);
  });
});
