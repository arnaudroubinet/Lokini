import { describe, it, expect } from "vitest";
import {
  createEmptyContent,
  createNoteDocument,
  isValidNoteContent,
  isValidBlockNode,
  isValidTextNode,
  isValidListItemNode,
  isValidMark,
  isValidHeadingLevel,
  NOTE_SCHEMA,
  VALID_MARK_TYPES,
  VALID_NODE_TYPES,
  type NoteContent,
  type ParagraphNode,
  type HeadingNode,
  type BulletListNode,
  type OrderedListNode,
  type ListItemNode,
  type TextNode,
  type BoldMark,
  type ItalicMark,
  type LinkMark,
  type NoteMark,
  type BlockNode,
  type CreateNoteDocumentOptions,
} from "../../src/models/note";
import { DEFAULT_MAX_DEVICES } from "../../src/models/document";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function fakeNoteOptions(
  overrides?: Partial<CreateNoteDocumentOptions>,
): CreateNoteDocumentOptions {
  return {
    id: "note-abc-123",
    server: "https://lokini.example.com",
    ...overrides,
  };
}

function textNode(text: string, marks?: readonly NoteMark[]): TextNode {
  return marks ? { type: "text", text, marks } : { type: "text", text };
}

function paragraph(content?: readonly TextNode[]): ParagraphNode {
  return content ? { type: "paragraph", content } : { type: "paragraph" };
}

function heading(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  content?: readonly TextNode[],
): HeadingNode {
  return content
    ? { type: "heading", attrs: { level }, content }
    : { type: "heading", attrs: { level } };
}

function listItem(content: readonly BlockNode[]): ListItemNode {
  return { type: "listItem", content };
}

function bulletList(items: readonly ListItemNode[]): BulletListNode {
  return { type: "bulletList", content: items };
}

function orderedList(items: readonly ListItemNode[]): OrderedListNode {
  return { type: "orderedList", content: items };
}

// ---------------------------------------------------------------------------
// Schema constants
// ---------------------------------------------------------------------------

describe("NOTE_SCHEMA", () => {
  it("defines expected node types", () => {
    expect(NOTE_SCHEMA.nodes).toEqual([
      "doc",
      "paragraph",
      "heading",
      "bulletList",
      "orderedList",
      "listItem",
      "text",
    ]);
  });

  it("defines expected mark types", () => {
    expect(NOTE_SCHEMA.marks).toEqual(["bold", "italic", "link"]);
  });

  it("has doc as top node", () => {
    expect(NOTE_SCHEMA.topNode).toBe("doc");
  });
});

describe("VALID_NODE_TYPES", () => {
  it("contains all expected node types", () => {
    expect(VALID_NODE_TYPES).toContain("doc");
    expect(VALID_NODE_TYPES).toContain("paragraph");
    expect(VALID_NODE_TYPES).toContain("heading");
    expect(VALID_NODE_TYPES).toContain("bulletList");
    expect(VALID_NODE_TYPES).toContain("orderedList");
    expect(VALID_NODE_TYPES).toContain("listItem");
    expect(VALID_NODE_TYPES).toContain("text");
    expect(VALID_NODE_TYPES).toHaveLength(7);
  });
});

describe("VALID_MARK_TYPES", () => {
  it("contains all expected mark types", () => {
    expect(VALID_MARK_TYPES).toContain("bold");
    expect(VALID_MARK_TYPES).toContain("italic");
    expect(VALID_MARK_TYPES).toContain("link");
    expect(VALID_MARK_TYPES).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// Mark validation
// ---------------------------------------------------------------------------

describe("isValidMark", () => {
  it("accepts bold mark", () => {
    const mark: BoldMark = { type: "bold" };
    expect(isValidMark(mark)).toBe(true);
  });

  it("accepts italic mark", () => {
    const mark: ItalicMark = { type: "italic" };
    expect(isValidMark(mark)).toBe(true);
  });

  it("accepts link mark with href", () => {
    const mark: LinkMark = {
      type: "link",
      attrs: { href: "https://example.com" },
    };
    expect(isValidMark(mark)).toBe(true);
  });

  it("accepts link mark with href and title", () => {
    const mark: LinkMark = {
      type: "link",
      attrs: { href: "https://example.com", title: "Example" },
    };
    expect(isValidMark(mark)).toBe(true);
  });

  it("rejects link mark with empty href", () => {
    const mark: LinkMark = { type: "link", attrs: { href: "" } };
    expect(isValidMark(mark)).toBe(false);
  });

  it("rejects link mark without attrs", () => {
    const mark = { type: "link" } as unknown as NoteMark;
    expect(isValidMark(mark)).toBe(false);
  });

  it("rejects unknown mark type", () => {
    const mark = { type: "underline" } as unknown as NoteMark;
    expect(isValidMark(mark)).toBe(false);
  });

  it("rejects null mark", () => {
    expect(isValidMark(null as unknown as NoteMark)).toBe(false);
  });

  it("rejects mark with non-string type", () => {
    const mark = { type: 42 } as unknown as NoteMark;
    expect(isValidMark(mark)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Text node validation
// ---------------------------------------------------------------------------

describe("isValidTextNode", () => {
  it("accepts text node with content", () => {
    expect(isValidTextNode(textNode("Hello"))).toBe(true);
  });

  it("accepts text node with marks", () => {
    const node = textNode("Bold text", [{ type: "bold" }]);
    expect(isValidTextNode(node)).toBe(true);
  });

  it("accepts text node with multiple marks", () => {
    const node = textNode("Bold italic", [
      { type: "bold" },
      { type: "italic" },
    ]);
    expect(isValidTextNode(node)).toBe(true);
  });

  it("accepts text node with link mark", () => {
    const node = textNode("Click here", [
      { type: "link", attrs: { href: "https://example.com" } },
    ]);
    expect(isValidTextNode(node)).toBe(true);
  });

  it("rejects text node with empty text", () => {
    expect(isValidTextNode(textNode(""))).toBe(false);
  });

  it("rejects text node with wrong type", () => {
    const node = { type: "paragraph", text: "hello" } as unknown as TextNode;
    expect(isValidTextNode(node)).toBe(false);
  });

  it("rejects text node with non-string text", () => {
    const node = { type: "text", text: 42 } as unknown as TextNode;
    expect(isValidTextNode(node)).toBe(false);
  });

  it("rejects text node with invalid mark", () => {
    const node = textNode("test", [
      { type: "underline" } as unknown as NoteMark,
    ]);
    expect(isValidTextNode(node)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Heading level validation
// ---------------------------------------------------------------------------

describe("isValidHeadingLevel", () => {
  it("accepts levels 1 through 6", () => {
    for (let i = 1; i <= 6; i++) {
      expect(isValidHeadingLevel(i)).toBe(true);
    }
  });

  it("rejects level 0", () => {
    expect(isValidHeadingLevel(0)).toBe(false);
  });

  it("rejects level 7", () => {
    expect(isValidHeadingLevel(7)).toBe(false);
  });

  it("rejects negative levels", () => {
    expect(isValidHeadingLevel(-1)).toBe(false);
  });

  it("rejects non-integer levels", () => {
    expect(isValidHeadingLevel(1.5)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Block node validation
// ---------------------------------------------------------------------------

describe("isValidBlockNode", () => {
  describe("paragraph", () => {
    it("accepts empty paragraph", () => {
      expect(isValidBlockNode(paragraph())).toBe(true);
    });

    it("accepts paragraph with text content", () => {
      expect(isValidBlockNode(paragraph([textNode("Hello world")]))).toBe(true);
    });

    it("accepts paragraph with formatted text", () => {
      const node = paragraph([
        textNode("Hello "),
        textNode("bold", [{ type: "bold" }]),
        textNode(" world"),
      ]);
      expect(isValidBlockNode(node)).toBe(true);
    });

    it("rejects paragraph with invalid content", () => {
      const node = {
        type: "paragraph",
        content: [{ type: "paragraph" }],
      } as unknown as BlockNode;
      expect(isValidBlockNode(node)).toBe(false);
    });
  });

  describe("heading", () => {
    it("accepts heading with level 1", () => {
      expect(isValidBlockNode(heading(1))).toBe(true);
    });

    it("accepts heading with level 6", () => {
      expect(isValidBlockNode(heading(6))).toBe(true);
    });

    it("accepts heading with text content", () => {
      expect(isValidBlockNode(heading(2, [textNode("Title")]))).toBe(true);
    });

    it("rejects heading with invalid level", () => {
      const node = {
        type: "heading",
        attrs: { level: 0 },
      } as unknown as BlockNode;
      expect(isValidBlockNode(node)).toBe(false);
    });

    it("rejects heading without attrs", () => {
      const node = { type: "heading" } as unknown as BlockNode;
      expect(isValidBlockNode(node)).toBe(false);
    });

    it("rejects heading with level 7", () => {
      const node = {
        type: "heading",
        attrs: { level: 7 },
      } as unknown as BlockNode;
      expect(isValidBlockNode(node)).toBe(false);
    });
  });

  describe("bulletList", () => {
    it("accepts bullet list with items", () => {
      const list = bulletList([listItem([paragraph([textNode("Item 1")])])]);
      expect(isValidBlockNode(list)).toBe(true);
    });

    it("accepts bullet list with multiple items", () => {
      const list = bulletList([
        listItem([paragraph([textNode("Item 1")])]),
        listItem([paragraph([textNode("Item 2")])]),
        listItem([paragraph([textNode("Item 3")])]),
      ]);
      expect(isValidBlockNode(list)).toBe(true);
    });

    it("rejects empty bullet list", () => {
      const node = { type: "bulletList", content: [] } as unknown as BlockNode;
      expect(isValidBlockNode(node)).toBe(false);
    });

    it("rejects bullet list without content", () => {
      const node = { type: "bulletList" } as unknown as BlockNode;
      expect(isValidBlockNode(node)).toBe(false);
    });
  });

  describe("orderedList", () => {
    it("accepts ordered list with items", () => {
      const list = orderedList([listItem([paragraph([textNode("Step 1")])])]);
      expect(isValidBlockNode(list)).toBe(true);
    });

    it("rejects empty ordered list", () => {
      const node = { type: "orderedList", content: [] } as unknown as BlockNode;
      expect(isValidBlockNode(node)).toBe(false);
    });
  });

  it("rejects unknown node type", () => {
    const node = { type: "codeBlock", content: [] } as unknown as BlockNode;
    expect(isValidBlockNode(node)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// List item validation
// ---------------------------------------------------------------------------

describe("isValidListItemNode", () => {
  it("accepts list item with paragraph", () => {
    const item = listItem([paragraph([textNode("Item")])]);
    expect(isValidListItemNode(item)).toBe(true);
  });

  it("accepts list item with multiple blocks", () => {
    const item = listItem([
      paragraph([textNode("First paragraph")]),
      paragraph([textNode("Second paragraph")]),
    ]);
    expect(isValidListItemNode(item)).toBe(true);
  });

  it("accepts nested list inside list item", () => {
    const item = listItem([
      paragraph([textNode("Parent")]),
      bulletList([listItem([paragraph([textNode("Child")])])]),
    ]);
    expect(isValidListItemNode(item)).toBe(true);
  });

  it("rejects list item with empty content", () => {
    const item = { type: "listItem", content: [] } as unknown as ListItemNode;
    expect(isValidListItemNode(item)).toBe(false);
  });

  it("rejects list item without content", () => {
    const item = { type: "listItem" } as unknown as ListItemNode;
    expect(isValidListItemNode(item)).toBe(false);
  });

  it("rejects node with wrong type", () => {
    const item = {
      type: "paragraph",
      content: [{ type: "paragraph" }],
    } as unknown as ListItemNode;
    expect(isValidListItemNode(item)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// NoteContent validation
// ---------------------------------------------------------------------------

describe("isValidNoteContent", () => {
  it("accepts empty doc with single paragraph", () => {
    const content = createEmptyContent();
    expect(isValidNoteContent(content)).toBe(true);
  });

  it("accepts doc with multiple paragraphs", () => {
    const content: NoteContent = {
      type: "doc",
      content: [
        paragraph([textNode("First paragraph")]),
        paragraph([textNode("Second paragraph")]),
      ],
    };
    expect(isValidNoteContent(content)).toBe(true);
  });

  it("accepts doc with mixed block types", () => {
    const content: NoteContent = {
      type: "doc",
      content: [
        heading(1, [textNode("Title")]),
        paragraph([textNode("Some text")]),
        bulletList([
          listItem([paragraph([textNode("Item 1")])]),
          listItem([paragraph([textNode("Item 2")])]),
        ]),
        orderedList([
          listItem([paragraph([textNode("Step 1")])]),
          listItem([paragraph([textNode("Step 2")])]),
        ]),
      ],
    };
    expect(isValidNoteContent(content)).toBe(true);
  });

  it("accepts doc with formatted text", () => {
    const content: NoteContent = {
      type: "doc",
      content: [
        paragraph([
          textNode("Normal "),
          textNode("bold", [{ type: "bold" }]),
          textNode(" and "),
          textNode("italic", [{ type: "italic" }]),
          textNode(" and "),
          textNode("link", [
            { type: "link", attrs: { href: "https://example.com" } },
          ]),
        ]),
      ],
    };
    expect(isValidNoteContent(content)).toBe(true);
  });

  it("accepts empty doc (no content blocks)", () => {
    const content: NoteContent = { type: "doc", content: [] };
    expect(isValidNoteContent(content)).toBe(true);
  });

  it("rejects null content", () => {
    expect(isValidNoteContent(null as unknown as NoteContent)).toBe(false);
  });

  it("rejects content with wrong root type", () => {
    const content = {
      type: "paragraph",
      content: [],
    } as unknown as NoteContent;
    expect(isValidNoteContent(content)).toBe(false);
  });

  it("rejects content without content array", () => {
    const content = { type: "doc" } as unknown as NoteContent;
    expect(isValidNoteContent(content)).toBe(false);
  });

  it("rejects content with invalid block nodes", () => {
    const content = {
      type: "doc",
      content: [{ type: "unknown" }],
    } as unknown as NoteContent;
    expect(isValidNoteContent(content)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// createEmptyContent
// ---------------------------------------------------------------------------

describe("createEmptyContent", () => {
  it("returns a doc with a single empty paragraph", () => {
    const content = createEmptyContent();
    expect(content.type).toBe("doc");
    expect(content.content).toHaveLength(1);
    expect(content.content[0].type).toBe("paragraph");
  });

  it("empty paragraph has no content property", () => {
    const content = createEmptyContent();
    const para = content.content[0] as ParagraphNode;
    expect(para.content).toBeUndefined();
  });

  it("produces valid NoteContent", () => {
    expect(isValidNoteContent(createEmptyContent())).toBe(true);
  });

  it("returns a new object each time", () => {
    const a = createEmptyContent();
    const b = createEmptyContent();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

// ---------------------------------------------------------------------------
// createNoteDocument
// ---------------------------------------------------------------------------

describe("createNoteDocument", () => {
  it("creates a note document with default content", () => {
    const doc = createNoteDocument(fakeNoteOptions());
    expect(doc.metadata.type).toBe("note");
    expect(doc.metadata.id).toBe("note-abc-123");
    expect(doc.metadata.server).toBe("https://lokini.example.com");
    expect(doc.content.type).toBe("doc");
    expect(doc.content.content).toHaveLength(1);
  });

  it("creates a note document with custom title", () => {
    const doc = createNoteDocument(fakeNoteOptions({ title: "My Note" }));
    expect(doc.metadata.title).toBe("My Note");
  });

  it("auto-generates title when not provided", () => {
    const date = new Date(2026, 1, 22);
    const doc = createNoteDocument(fakeNoteOptions({ createdAt: date }));
    expect(doc.metadata.title).toBe("Note du 22/02/2026");
  });

  it("uses default maxDevices of 40", () => {
    const doc = createNoteDocument(fakeNoteOptions());
    expect(doc.metadata.maxDevices).toBe(DEFAULT_MAX_DEVICES);
  });

  it("accepts custom maxDevices", () => {
    const doc = createNoteDocument(fakeNoteOptions({ maxDevices: 10 }));
    expect(doc.metadata.maxDevices).toBe(10);
  });

  it("starts with empty participant list", () => {
    const doc = createNoteDocument(fakeNoteOptions());
    expect(doc.metadata.participants).toHaveLength(0);
  });

  it("uses custom content when provided", () => {
    const content: NoteContent = {
      type: "doc",
      content: [
        heading(1, [textNode("Welcome")]),
        paragraph([textNode("Hello world")]),
      ],
    };
    const doc = createNoteDocument(fakeNoteOptions({ content }));
    expect(doc.content.content).toHaveLength(2);
    expect(doc.content.content[0].type).toBe("heading");
    expect(doc.content.content[1].type).toBe("paragraph");
  });

  it("uses empty content by default", () => {
    const doc = createNoteDocument(fakeNoteOptions());
    expect(doc.content).toEqual(createEmptyContent());
  });

  it("always sets type to note", () => {
    const doc = createNoteDocument(fakeNoteOptions());
    expect(doc.metadata.type).toBe("note");
  });

  it("stores creation date as ISO string", () => {
    const date = new Date(2026, 1, 22, 10, 30, 0);
    const doc = createNoteDocument(fakeNoteOptions({ createdAt: date }));
    expect(doc.metadata.createdAt).toBe(date.toISOString());
  });

  // Error cases
  it("throws on empty document id", () => {
    expect(() => createNoteDocument(fakeNoteOptions({ id: "" }))).toThrow();
  });

  it("throws on empty server address", () => {
    expect(() => createNoteDocument(fakeNoteOptions({ server: "" }))).toThrow();
  });

  it("throws on invalid maxDevices", () => {
    expect(() =>
      createNoteDocument(fakeNoteOptions({ maxDevices: 0 })),
    ).toThrow();
    expect(() =>
      createNoteDocument(fakeNoteOptions({ maxDevices: -1 })),
    ).toThrow();
  });

  it("throws on invalid content", () => {
    const invalidContent = {
      type: "doc",
      content: [{ type: "unknown" }],
    } as unknown as NoteContent;
    expect(() =>
      createNoteDocument(fakeNoteOptions({ content: invalidContent })),
    ).toThrow("Invalid note content: AST structure is not valid");
  });

  it("throws on null content", () => {
    expect(() =>
      createNoteDocument(
        fakeNoteOptions({ content: null as unknown as NoteContent }),
      ),
    ).toThrow("Invalid note content");
  });
});

// ---------------------------------------------------------------------------
// Complex document structures
// ---------------------------------------------------------------------------

describe("complex document structures", () => {
  it("supports deeply nested lists", () => {
    const content: NoteContent = {
      type: "doc",
      content: [
        bulletList([
          listItem([
            paragraph([textNode("Level 1")]),
            bulletList([
              listItem([
                paragraph([textNode("Level 2")]),
                bulletList([listItem([paragraph([textNode("Level 3")])])]),
              ]),
            ]),
          ]),
        ]),
      ],
    };
    expect(isValidNoteContent(content)).toBe(true);
  });

  it("supports mixed formatting in paragraphs", () => {
    const content: NoteContent = {
      type: "doc",
      content: [
        paragraph([
          textNode("This is "),
          textNode("bold and italic", [{ type: "bold" }, { type: "italic" }]),
          textNode(" with a "),
          textNode("link", [
            {
              type: "link",
              attrs: { href: "https://lokini.dev", title: "Lokini" },
            },
            { type: "bold" },
          ]),
          textNode("."),
        ]),
      ],
    };
    expect(isValidNoteContent(content)).toBe(true);
  });

  it("supports a complete note with all node types", () => {
    const content: NoteContent = {
      type: "doc",
      content: [
        heading(1, [textNode("Document Title")]),
        paragraph([textNode("Introduction paragraph.")]),
        heading(2, [textNode("Section 1")]),
        paragraph([
          textNode("Some "),
          textNode("bold", [{ type: "bold" }]),
          textNode(" text."),
        ]),
        bulletList([
          listItem([paragraph([textNode("Bullet 1")])]),
          listItem([paragraph([textNode("Bullet 2")])]),
        ]),
        heading(2, [textNode("Section 2")]),
        orderedList([
          listItem([paragraph([textNode("Step 1")])]),
          listItem([paragraph([textNode("Step 2")])]),
          listItem([paragraph([textNode("Step 3")])]),
        ]),
        paragraph([
          textNode("Visit "),
          textNode("our site", [
            { type: "link", attrs: { href: "https://lokini.dev" } },
          ]),
          textNode(" for more."),
        ]),
      ],
    };
    expect(isValidNoteContent(content)).toBe(true);

    const doc = createNoteDocument(fakeNoteOptions({ content }));
    expect(doc.content.content).toHaveLength(8);
  });
});

// ---------------------------------------------------------------------------
// Type safety (compile-time checks confirmed at runtime)
// ---------------------------------------------------------------------------

describe("type discrimination", () => {
  it("NoteDocument metadata type is always note", () => {
    const doc = createNoteDocument(fakeNoteOptions());
    expect(doc.metadata.type).toBe("note");
  });

  it("NoteContent root type is always doc", () => {
    const content = createEmptyContent();
    expect(content.type).toBe("doc");
  });
});
