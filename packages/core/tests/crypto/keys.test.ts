import { describe, it, expect, beforeAll } from "vitest";
import sodium from "libsodium-wrappers-sumo";
import {
  generateX25519KeyPair,
  computeSharedSecret,
  X25519_PUBLIC_KEY_LENGTH,
  X25519_PRIVATE_KEY_LENGTH,
  SHARED_SECRET_LENGTH,
  type SharedSecret,
} from "../../src/crypto/keys";

// ---------------------------------------------------------------------------
// libsodium initialization
// ---------------------------------------------------------------------------

beforeAll(async () => {
  await sodium.ready;
});

// ---------------------------------------------------------------------------
// generateX25519KeyPair
// ---------------------------------------------------------------------------

describe("generateX25519KeyPair", () => {
  it("should generate a key pair with correct key lengths", async () => {
    const keyPair = await generateX25519KeyPair();

    expect(keyPair.publicKey).toBeInstanceOf(Uint8Array);
    expect(keyPair.privateKey).toBeInstanceOf(Uint8Array);
    expect(keyPair.publicKey.length).toBe(X25519_PUBLIC_KEY_LENGTH);
    expect(keyPair.privateKey.length).toBe(X25519_PRIVATE_KEY_LENGTH);
  });

  it("should generate unique key pairs on each call", async () => {
    const keyPair1 = await generateX25519KeyPair();
    const keyPair2 = await generateX25519KeyPair();

    expect(keyPair1.publicKey).not.toEqual(keyPair2.publicKey);
    expect(keyPair1.privateKey).not.toEqual(keyPair2.privateKey);
  });

  it("should generate non-zero keys", async () => {
    const keyPair = await generateX25519KeyPair();

    const publicKeyAllZero = keyPair.publicKey.every((b) => b === 0);
    const privateKeyAllZero = keyPair.privateKey.every((b) => b === 0);
    expect(publicKeyAllZero).toBe(false);
    expect(privateKeyAllZero).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// computeSharedSecret — DH property
// ---------------------------------------------------------------------------

describe("computeSharedSecret", () => {
  it("should produce the same shared secret from both sides (DH property)", async () => {
    const alice = await generateX25519KeyPair();
    const bob = await generateX25519KeyPair();

    const secretAlice = await computeSharedSecret(
      alice.privateKey,
      bob.publicKey,
    );
    const secretBob = await computeSharedSecret(
      bob.privateKey,
      alice.publicKey,
    );

    expect(secretAlice).toEqual(secretBob);
  });

  it("should return a shared secret of correct length", async () => {
    const alice = await generateX25519KeyPair();
    const bob = await generateX25519KeyPair();

    const secret = await computeSharedSecret(alice.privateKey, bob.publicKey);

    expect(secret).toBeInstanceOf(Uint8Array);
    expect(secret.length).toBe(SHARED_SECRET_LENGTH);
  });

  it("should produce different secrets with different key pairs", async () => {
    const alice = await generateX25519KeyPair();
    const bob = await generateX25519KeyPair();
    const charlie = await generateX25519KeyPair();

    const secretAB = await computeSharedSecret(alice.privateKey, bob.publicKey);
    const secretAC = await computeSharedSecret(
      alice.privateKey,
      charlie.publicKey,
    );

    expect(secretAB).not.toEqual(secretAC);
  });

  it("should produce a non-zero shared secret", async () => {
    const alice = await generateX25519KeyPair();
    const bob = await generateX25519KeyPair();

    const secret = await computeSharedSecret(alice.privateKey, bob.publicKey);

    const allZero = secret.every((b) => b === 0);
    expect(allZero).toBe(false);
  });

  it("should be deterministic for the same inputs", async () => {
    const alice = await generateX25519KeyPair();
    const bob = await generateX25519KeyPair();

    const secret1 = await computeSharedSecret(alice.privateKey, bob.publicKey);
    const secret2 = await computeSharedSecret(alice.privateKey, bob.publicKey);

    expect(secret1).toEqual(secret2);
  });
});

// ---------------------------------------------------------------------------
// computeSharedSecret — error cases
// ---------------------------------------------------------------------------

describe("computeSharedSecret — error handling", () => {
  it("should throw if private key has wrong length", async () => {
    const bob = await generateX25519KeyPair();

    await expect(
      computeSharedSecret(new Uint8Array(16), bob.publicKey),
    ).rejects.toThrow();
  });

  it("should throw if public key has wrong length", async () => {
    const alice = await generateX25519KeyPair();

    await expect(
      computeSharedSecret(alice.privateKey, new Uint8Array(16)),
    ).rejects.toThrow();
  });

  it("should throw if private key is empty", async () => {
    const bob = await generateX25519KeyPair();

    await expect(
      computeSharedSecret(new Uint8Array(0), bob.publicKey),
    ).rejects.toThrow();
  });

  it("should throw if public key is empty", async () => {
    const alice = await generateX25519KeyPair();

    await expect(
      computeSharedSecret(alice.privateKey, new Uint8Array(0)),
    ).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe("Constants", () => {
  it("should have correct X25519 key lengths", () => {
    expect(X25519_PUBLIC_KEY_LENGTH).toBe(32);
    expect(X25519_PRIVATE_KEY_LENGTH).toBe(32);
    expect(SHARED_SECRET_LENGTH).toBe(32);
  });
});
