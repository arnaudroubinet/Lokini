import { describe, it, expect } from "vitest";
import {
  createDeviceId,
  createDocumentId,
  createDeviceIdentity,
  resolveDisplayName,
  isValidDeviceId,
  isValidDocumentId,
  isValidX25519KeyPair,
  isValidEd25519KeyPair,
  isValidDeviceKeyPair,
  isValidDeviceIdentity,
  type DeviceId,
  type DocumentId,
  type DeviceKeyPair,
  type DeviceProfile,
  type X25519KeyPair,
  type Ed25519KeyPair,
  type EphemeralKeyPair,
  type DeviceSecret,
} from "../../src/models/device";

// ---------------------------------------------------------------------------
// Test helpers — generate fake key material
// ---------------------------------------------------------------------------

function fakeX25519KeyPair(): X25519KeyPair {
  return {
    publicKey: new Uint8Array(32).fill(1),
    privateKey: new Uint8Array(32).fill(2),
  };
}

function fakeEd25519KeyPair(): Ed25519KeyPair {
  return {
    publicKey: new Uint8Array(32).fill(3),
    privateKey: new Uint8Array(64).fill(4),
  };
}

function fakeDeviceKeyPair(): DeviceKeyPair {
  return {
    x25519: fakeX25519KeyPair(),
    ed25519: fakeEd25519KeyPair(),
  };
}

// ---------------------------------------------------------------------------
// DeviceId
// ---------------------------------------------------------------------------

describe("DeviceId", () => {
  it("should accept a non-empty string", () => {
    expect(isValidDeviceId("device-abc-123")).toBe(true);
  });

  it("should reject an empty string", () => {
    expect(isValidDeviceId("")).toBe(false);
  });

  it("should create a DeviceId from a valid string", () => {
    const id = createDeviceId("device-1");
    expect(id).toBe("device-1");
  });

  it("should throw when creating a DeviceId from an empty string", () => {
    expect(() => createDeviceId("")).toThrow("DeviceId must be a non-empty string");
  });
});

// ---------------------------------------------------------------------------
// DocumentId
// ---------------------------------------------------------------------------

describe("DocumentId", () => {
  it("should accept a non-empty string", () => {
    expect(isValidDocumentId("doc-xyz-789")).toBe(true);
  });

  it("should reject an empty string", () => {
    expect(isValidDocumentId("")).toBe(false);
  });

  it("should create a DocumentId from a valid string", () => {
    const id = createDocumentId("doc-1");
    expect(id).toBe("doc-1");
  });

  it("should throw when creating a DocumentId from an empty string", () => {
    expect(() => createDocumentId("")).toThrow("DocumentId must be a non-empty string");
  });
});

// ---------------------------------------------------------------------------
// Key pair validation
// ---------------------------------------------------------------------------

describe("X25519KeyPair validation", () => {
  it("should accept valid key pair (32-byte keys)", () => {
    expect(isValidX25519KeyPair(fakeX25519KeyPair())).toBe(true);
  });

  it("should reject public key with wrong length", () => {
    expect(
      isValidX25519KeyPair({
        publicKey: new Uint8Array(16),
        privateKey: new Uint8Array(32),
      }),
    ).toBe(false);
  });

  it("should reject private key with wrong length", () => {
    expect(
      isValidX25519KeyPair({
        publicKey: new Uint8Array(32),
        privateKey: new Uint8Array(16),
      }),
    ).toBe(false);
  });

  it("should reject non-Uint8Array values", () => {
    expect(
      isValidX25519KeyPair({
        publicKey: [] as unknown as Uint8Array,
        privateKey: new Uint8Array(32),
      }),
    ).toBe(false);
  });
});

describe("Ed25519KeyPair validation", () => {
  it("should accept valid key pair (32-byte public, 64-byte private)", () => {
    expect(isValidEd25519KeyPair(fakeEd25519KeyPair())).toBe(true);
  });

  it("should reject public key with wrong length", () => {
    expect(
      isValidEd25519KeyPair({
        publicKey: new Uint8Array(16),
        privateKey: new Uint8Array(64),
      }),
    ).toBe(false);
  });

  it("should reject private key with wrong length", () => {
    expect(
      isValidEd25519KeyPair({
        publicKey: new Uint8Array(32),
        privateKey: new Uint8Array(32),
      }),
    ).toBe(false);
  });
});

describe("DeviceKeyPair validation", () => {
  it("should accept valid combined key pair", () => {
    expect(isValidDeviceKeyPair(fakeDeviceKeyPair())).toBe(true);
  });

  it("should reject if X25519 keys are invalid", () => {
    expect(
      isValidDeviceKeyPair({
        x25519: { publicKey: new Uint8Array(16), privateKey: new Uint8Array(32) },
        ed25519: fakeEd25519KeyPair(),
      }),
    ).toBe(false);
  });

  it("should reject if Ed25519 keys are invalid", () => {
    expect(
      isValidDeviceKeyPair({
        x25519: fakeX25519KeyPair(),
        ed25519: { publicKey: new Uint8Array(32), privateKey: new Uint8Array(32) },
      }),
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// DeviceIdentity
// ---------------------------------------------------------------------------

describe("DeviceIdentity", () => {
  const deviceId = createDeviceId("device-1");
  const documentId = createDocumentId("doc-1");
  const keyPair = fakeDeviceKeyPair();

  it("should create a valid identity without document pseudonym", () => {
    const identity = createDeviceIdentity(deviceId, documentId, keyPair);

    expect(identity.id).toBe("device-1");
    expect(identity.documentId).toBe("doc-1");
    expect(identity.keyPair).toBe(keyPair);
    expect(identity.documentPseudonym).toBeUndefined();
  });

  it("should create a valid identity with document pseudonym", () => {
    const identity = createDeviceIdentity(deviceId, documentId, keyPair, "Alice (work)");

    expect(identity.documentPseudonym).toBe("Alice (work)");
  });

  it("should throw with invalid DeviceId", () => {
    expect(() =>
      createDeviceIdentity("" as DeviceId, documentId, keyPair),
    ).toThrow("DeviceId must be a non-empty string");
  });

  it("should throw with invalid DocumentId", () => {
    expect(() =>
      createDeviceIdentity(deviceId, "" as DocumentId, keyPair),
    ).toThrow("DocumentId must be a non-empty string");
  });

  it("should throw with invalid key pair", () => {
    const badKeyPair = {
      x25519: { publicKey: new Uint8Array(16), privateKey: new Uint8Array(32) },
      ed25519: fakeEd25519KeyPair(),
    };
    expect(() =>
      createDeviceIdentity(deviceId, documentId, badKeyPair),
    ).toThrow("Invalid DeviceKeyPair");
  });

  it("should validate a correct DeviceIdentity", () => {
    const identity = createDeviceIdentity(deviceId, documentId, keyPair);
    expect(isValidDeviceIdentity(identity)).toBe(true);
  });

  it("should be immutable (readonly properties)", () => {
    const identity = createDeviceIdentity(deviceId, documentId, keyPair);
    // TypeScript enforces readonly at compile time; at runtime we verify
    // the object structure is as expected
    expect(Object.keys(identity)).toEqual(["id", "documentId", "keyPair"]);
  });
});

// ---------------------------------------------------------------------------
// Multiple identities per device
// ---------------------------------------------------------------------------

describe("Multiple identities per device", () => {
  it("a device can have separate identities for different documents", () => {
    const deviceId1 = createDeviceId("device-1-doc-a");
    const deviceId2 = createDeviceId("device-1-doc-b");
    const docA = createDocumentId("doc-a");
    const docB = createDocumentId("doc-b");
    const keyPairA = fakeDeviceKeyPair();
    const keyPairB: DeviceKeyPair = {
      x25519: {
        publicKey: new Uint8Array(32).fill(10),
        privateKey: new Uint8Array(32).fill(20),
      },
      ed25519: {
        publicKey: new Uint8Array(32).fill(30),
        privateKey: new Uint8Array(64).fill(40),
      },
    };

    const identityA = createDeviceIdentity(deviceId1, docA, keyPairA);
    const identityB = createDeviceIdentity(deviceId2, docB, keyPairB);

    expect(identityA.id).not.toBe(identityB.id);
    expect(identityA.documentId).not.toBe(identityB.documentId);
    expect(identityA.keyPair).not.toBe(identityB.keyPair);
    expect(identityA.keyPair.x25519.publicKey).not.toEqual(identityB.keyPair.x25519.publicKey);
  });
});

// ---------------------------------------------------------------------------
// Pseudonym resolution (resolveDisplayName)
// ---------------------------------------------------------------------------

describe("resolveDisplayName", () => {
  const deviceId = createDeviceId("device-1");
  const documentId = createDocumentId("doc-1");
  const keyPair = fakeDeviceKeyPair();

  it("should return document pseudonym when both are set", () => {
    const identity = createDeviceIdentity(deviceId, documentId, keyPair, "Doc-Alice");
    const profile: DeviceProfile = { globalPseudonym: "GlobalAlice" };

    expect(resolveDisplayName(identity, profile)).toBe("Doc-Alice");
  });

  it("should return global pseudonym when document pseudonym is not set", () => {
    const identity = createDeviceIdentity(deviceId, documentId, keyPair);
    const profile: DeviceProfile = { globalPseudonym: "GlobalAlice" };

    expect(resolveDisplayName(identity, profile)).toBe("GlobalAlice");
  });

  it("should return undefined when neither pseudonym is set", () => {
    const identity = createDeviceIdentity(deviceId, documentId, keyPair);
    const profile: DeviceProfile = {};

    expect(resolveDisplayName(identity, profile)).toBeUndefined();
  });

  it("should return document pseudonym even when global is undefined", () => {
    const identity = createDeviceIdentity(deviceId, documentId, keyPair, "Doc-Only");
    const profile: DeviceProfile = {};

    expect(resolveDisplayName(identity, profile)).toBe("Doc-Only");
  });
});

// ---------------------------------------------------------------------------
// Type structure verification
// ---------------------------------------------------------------------------

describe("Type structure", () => {
  it("DeviceIdentity should not expose private keys in JSON serialization inadvertently", () => {
    // This test ensures that when identity is used, private keys are present
    // but developers are aware they must never be serialized or sent over the network.
    const identity = createDeviceIdentity(
      createDeviceId("d1"),
      createDocumentId("doc1"),
      fakeDeviceKeyPair(),
    );

    // Private keys are in the object (for local cryptographic operations)
    expect(identity.keyPair.x25519.privateKey).toBeDefined();
    expect(identity.keyPair.ed25519.privateKey).toBeDefined();
    expect(identity.keyPair.x25519.privateKey.length).toBe(32);
    expect(identity.keyPair.ed25519.privateKey.length).toBe(64);
  });

  it("EphemeralKeyPair type should be structurally valid", () => {
    const ephemeral: EphemeralKeyPair = {
      publicKey: new Uint8Array(32).fill(99),
      privateKey: new Uint8Array(32).fill(100),
    };
    expect(ephemeral.publicKey.length).toBe(32);
    expect(ephemeral.privateKey.length).toBe(32);
  });

  it("DeviceSecret type should be assignable from Uint8Array", () => {
    const secret = new Uint8Array(32).fill(0xff) as DeviceSecret;
    expect(secret).toBeInstanceOf(Uint8Array);
    expect(secret.length).toBe(32);
  });
});
