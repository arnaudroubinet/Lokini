import { describe, it, expect, beforeAll } from "vitest";
import sodium from "libsodium-wrappers-sumo";
import {
  hkdfExtract,
  hkdfExpand,
  hkdfDerive,
  HKDF_HASH_LENGTH,
  HKDF_MAX_OUTPUT_LENGTH,
} from "../../src/crypto/kdf";

// ---------------------------------------------------------------------------
// libsodium initialization
// ---------------------------------------------------------------------------

beforeAll(async () => {
  await sodium.ready;
});

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

// ===========================================================================
// RFC 5869 Test Vectors (Appendix A)
// ===========================================================================

describe("HKDF-SHA256 — RFC 5869 test vectors", () => {
  // Test Case 1 (Appendix A.1)
  describe("Test Case 1 (A.1)", () => {
    const ikm = fromHex("0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b");
    const salt = fromHex("000102030405060708090a0b0c");
    const info = fromHex("f0f1f2f3f4f5f6f7f8f9");
    const expectedPrk = fromHex(
      "077709362c2e32df0ddc3f0dc47bba6390b6c73bb50f9c3122ec844ad7c2b3e5",
    );
    const expectedOkm = fromHex(
      "3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865",
    );

    it("extract produces correct PRK", async () => {
      const prk = await hkdfExtract(ikm, salt);
      expect(toHex(prk)).toBe(toHex(expectedPrk));
    });

    it("expand produces correct OKM", async () => {
      const okm = await hkdfExpand(expectedPrk, info, 42);
      expect(toHex(okm)).toBe(toHex(expectedOkm));
    });

    it("derive (combined) produces correct OKM", async () => {
      const okm = await hkdfDerive(ikm, salt, info, 42);
      expect(toHex(okm)).toBe(toHex(expectedOkm));
    });
  });

  // Test Case 2 (Appendix A.2) — longer inputs/outputs
  describe("Test Case 2 (A.2)", () => {
    const ikm = fromHex(
      "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f" +
        "202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f" +
        "404142434445464748494a4b4c4d4e4f",
    );
    const salt = fromHex(
      "606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f" +
        "808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f" +
        "a0a1a2a3a4a5a6a7a8a9aaabacadaeaf",
    );
    const info = fromHex(
      "b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecf" +
        "d0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeef" +
        "f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff",
    );
    const expectedPrk = fromHex(
      "06a6b88c5853361a06104c9ceb35b45cef760014904671014a193f40c15fc244",
    );
    const expectedOkm = fromHex(
      "b11e398dc80327a1c8e7f78c596a49344f012eda2d4efad8a050cc4c19afa97c" +
        "59045a99cac7827271cb41c65e590e09da3275600c2f09b8367793a9aca3db71" +
        "cc30c58179ec3e87c14c01d5c1f3434f1d87",
    );

    it("extract produces correct PRK", async () => {
      const prk = await hkdfExtract(ikm, salt);
      expect(toHex(prk)).toBe(toHex(expectedPrk));
    });

    it("expand produces correct OKM", async () => {
      const okm = await hkdfExpand(expectedPrk, info, 82);
      expect(toHex(okm)).toBe(toHex(expectedOkm));
    });

    it("derive (combined) produces correct OKM", async () => {
      const okm = await hkdfDerive(ikm, salt, info, 82);
      expect(toHex(okm)).toBe(toHex(expectedOkm));
    });
  });

  // Test Case 3 (Appendix A.3) — zero-length salt and info
  describe("Test Case 3 (A.3)", () => {
    const ikm = fromHex("0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b");
    const salt = new Uint8Array(0);
    const info = new Uint8Array(0);
    const expectedPrk = fromHex(
      "19ef24a32c717b167f33a91d6f648bdf96596776afdb6377ac434c1c293ccb04",
    );
    const expectedOkm = fromHex(
      "8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d" +
        "9d201395faa4b61a96c8",
    );

    it("extract with empty salt produces correct PRK", async () => {
      const prk = await hkdfExtract(ikm, salt);
      expect(toHex(prk)).toBe(toHex(expectedPrk));
    });

    it("extract with undefined salt produces same PRK", async () => {
      const prk = await hkdfExtract(ikm, undefined);
      expect(toHex(prk)).toBe(toHex(expectedPrk));
    });

    it("expand produces correct OKM", async () => {
      const okm = await hkdfExpand(expectedPrk, info, 42);
      expect(toHex(okm)).toBe(toHex(expectedOkm));
    });

    it("derive (combined) produces correct OKM", async () => {
      const okm = await hkdfDerive(ikm, salt, info, 42);
      expect(toHex(okm)).toBe(toHex(expectedOkm));
    });
  });
});

// ===========================================================================
// Determinism
// ===========================================================================

describe("HKDF-SHA256 — determinism", () => {
  it("same inputs produce same output", async () => {
    const ikm = new Uint8Array(32).fill(0xaa);
    const salt = new Uint8Array(16).fill(0xbb);
    const info = textToBytes("encryption");

    const result1 = await hkdfDerive(ikm, salt, info, 32);
    const result2 = await hkdfDerive(ikm, salt, info, 32);
    expect(toHex(result1)).toBe(toHex(result2));
  });

  it("extract is deterministic", async () => {
    const ikm = new Uint8Array(32).fill(0x01);
    const salt = new Uint8Array(32).fill(0x02);

    const prk1 = await hkdfExtract(ikm, salt);
    const prk2 = await hkdfExtract(ikm, salt);
    expect(toHex(prk1)).toBe(toHex(prk2));
  });
});

// ===========================================================================
// Domain separation
// ===========================================================================

describe("HKDF-SHA256 — domain separation", () => {
  const ikm = new Uint8Array(32).fill(0xcc);
  const salt = new Uint8Array(16).fill(0xdd);

  it("different info contexts produce different keys", async () => {
    const key1 = await hkdfDerive(ikm, salt, textToBytes("encryption"), 32);
    const key2 = await hkdfDerive(ikm, salt, textToBytes("signing"), 32);
    const key3 = await hkdfDerive(ikm, salt, textToBytes("storage"), 32);

    expect(toHex(key1)).not.toBe(toHex(key2));
    expect(toHex(key1)).not.toBe(toHex(key3));
    expect(toHex(key2)).not.toBe(toHex(key3));
  });

  it("different salts produce different keys", async () => {
    const key1 = await hkdfDerive(
      ikm,
      new Uint8Array(16).fill(0x01),
      textToBytes("test"),
      32,
    );
    const key2 = await hkdfDerive(
      ikm,
      new Uint8Array(16).fill(0x02),
      textToBytes("test"),
      32,
    );
    expect(toHex(key1)).not.toBe(toHex(key2));
  });

  it("different IKMs produce different keys", async () => {
    const key1 = await hkdfDerive(
      new Uint8Array(32).fill(0x01),
      salt,
      textToBytes("test"),
      32,
    );
    const key2 = await hkdfDerive(
      new Uint8Array(32).fill(0x02),
      salt,
      textToBytes("test"),
      32,
    );
    expect(toHex(key1)).not.toBe(toHex(key2));
  });
});

// ===========================================================================
// Output length
// ===========================================================================

describe("HKDF-SHA256 — configurable output length", () => {
  const ikm = new Uint8Array(32).fill(0xee);
  const salt = new Uint8Array(16).fill(0xff);
  const info = textToBytes("length-test");

  it("produces 16-byte output", async () => {
    const key = await hkdfDerive(ikm, salt, info, 16);
    expect(key.length).toBe(16);
  });

  it("produces 32-byte output", async () => {
    const key = await hkdfDerive(ikm, salt, info, 32);
    expect(key.length).toBe(32);
  });

  it("produces 64-byte output", async () => {
    const key = await hkdfDerive(ikm, salt, info, 64);
    expect(key.length).toBe(64);
  });

  it("produces 1-byte output", async () => {
    const key = await hkdfDerive(ikm, salt, info, 1);
    expect(key.length).toBe(1);
  });

  it("shorter output is a prefix of longer output", async () => {
    const short = await hkdfExpand(await hkdfExtract(ikm, salt), info, 16);
    const long = await hkdfExpand(await hkdfExtract(ikm, salt), info, 32);
    expect(toHex(long).startsWith(toHex(short))).toBe(true);
  });
});

// ===========================================================================
// Error handling
// ===========================================================================

describe("HKDF-SHA256 — error handling", () => {
  describe("hkdfExtract", () => {
    it("throws for empty IKM", async () => {
      await expect(hkdfExtract(new Uint8Array(0))).rejects.toThrow(
        "IKM must be a non-empty Uint8Array",
      );
    });

    it("throws for non-Uint8Array IKM", async () => {
      await expect(
        hkdfExtract("not bytes" as unknown as Uint8Array),
      ).rejects.toThrow("IKM must be a non-empty Uint8Array");
    });
  });

  describe("hkdfExpand", () => {
    it("throws for PRK shorter than hash length", async () => {
      const shortPrk = new Uint8Array(16);
      const info = new Uint8Array(0);
      await expect(hkdfExpand(shortPrk, info, 32)).rejects.toThrow(
        `PRK must be at least ${HKDF_HASH_LENGTH} bytes`,
      );
    });

    it("throws for non-Uint8Array PRK", async () => {
      await expect(
        hkdfExpand("not bytes" as unknown as Uint8Array, new Uint8Array(0), 32),
      ).rejects.toThrow("PRK must be at least");
    });

    it("throws for zero output length", async () => {
      const prk = new Uint8Array(32);
      await expect(hkdfExpand(prk, new Uint8Array(0), 0)).rejects.toThrow(
        "Output length must be between 1 and",
      );
    });

    it("throws for negative output length", async () => {
      const prk = new Uint8Array(32);
      await expect(hkdfExpand(prk, new Uint8Array(0), -1)).rejects.toThrow(
        "Output length must be between 1 and",
      );
    });

    it("throws for output length exceeding maximum", async () => {
      const prk = new Uint8Array(32);
      await expect(
        hkdfExpand(prk, new Uint8Array(0), HKDF_MAX_OUTPUT_LENGTH + 1),
      ).rejects.toThrow("Output length must be between 1 and");
    });

    it("throws for non-integer output length", async () => {
      const prk = new Uint8Array(32);
      await expect(hkdfExpand(prk, new Uint8Array(0), 32.5)).rejects.toThrow(
        "Output length must be between 1 and",
      );
    });
  });

  describe("hkdfDerive", () => {
    it("throws for empty IKM", async () => {
      await expect(
        hkdfDerive(new Uint8Array(0), undefined, new Uint8Array(0), 32),
      ).rejects.toThrow("IKM must be a non-empty Uint8Array");
    });

    it("throws for invalid output length", async () => {
      await expect(
        hkdfDerive(new Uint8Array(32).fill(1), undefined, new Uint8Array(0), 0),
      ).rejects.toThrow("Output length must be between 1 and");
    });
  });
});

// ===========================================================================
// Constants
// ===========================================================================

describe("HKDF-SHA256 — constants", () => {
  it("HKDF_HASH_LENGTH is 32", () => {
    expect(HKDF_HASH_LENGTH).toBe(32);
  });

  it("HKDF_MAX_OUTPUT_LENGTH is 255 * 32", () => {
    expect(HKDF_MAX_OUTPUT_LENGTH).toBe(255 * 32);
  });
});
