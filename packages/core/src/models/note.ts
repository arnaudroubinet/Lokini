/**
 * Note document type — rich text with ProseMirror-compatible AST.
 *
 * The Note type represents a rich-text document whose content is stored as
 * a JSON AST (Abstract Syntax Tree) compatible with ProseMirror's document
 * model. This allows seamless integration with ProseMirror editors while
 * keeping @lokini/core free of any ProseMirror dependency.
 *
 * Supported node types: doc, paragraph, heading, bulletList, orderedList, listItem, text
 * Supported marks: bold, italic, link
 *
 * @see SPECIFICATIONS.md §5.1 — Note type
 * @see SPECIFICATIONS.md §4.8 — CRDT sequence for text
 */

import {
  type DocumentMetadata,
  type CreateDocumentOptions,
  createDocument,
} from "./document";

// ---------------------------------------------------------------------------
// Mark types (inline formatting)
// ---------------------------------------------------------------------------

/** Bold mark — no attributes. */
export interface BoldMark {
  readonly type: "bold";
}

/** Italic mark — no attributes. */
export interface ItalicMark {
  readonly type: "italic";
}

/** Link mark — requires an href attribute. */
export interface LinkMark {
  readonly type: "link";
  readonly attrs: {
    readonly href: string;
    readonly title?: string;
  };
}

/** Union of all supported marks. */
export type NoteMark = BoldMark | ItalicMark | LinkMark;

/** Valid mark type names. */
export const VALID_MARK_TYPES = ["bold", "italic", "link"] as const;
export type NoteMarkType = (typeof VALID_MARK_TYPES)[number];

// ---------------------------------------------------------------------------
// Node types (block and inline)
// ---------------------------------------------------------------------------

/** Text node — leaf node containing actual text content. */
export interface TextNode {
  readonly type: "text";
  readonly text: string;
  readonly marks?: readonly NoteMark[];
}

/** Paragraph node — block containing inline content. */
export interface ParagraphNode {
  readonly type: "paragraph";
  readonly content?: readonly InlineNode[];
}

/** Heading node — block with a level attribute (1-6). */
export interface HeadingNode {
  readonly type: "heading";
  readonly attrs: {
    readonly level: HeadingLevel;
  };
  readonly content?: readonly InlineNode[];
}

/** Valid heading levels. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** List item node — wraps block content inside a list. */
export interface ListItemNode {
  readonly type: "listItem";
  readonly content: readonly BlockNode[];
}

/** Bullet (unordered) list node. */
export interface BulletListNode {
  readonly type: "bulletList";
  readonly content: readonly ListItemNode[];
}

/** Ordered (numbered) list node. */
export interface OrderedListNode {
  readonly type: "orderedList";
  readonly content: readonly ListItemNode[];
}

/** Inline nodes — can appear inside paragraphs and headings. */
export type InlineNode = TextNode;

/** Block nodes — top-level content nodes. */
export type BlockNode =
  | ParagraphNode
  | HeadingNode
  | BulletListNode
  | OrderedListNode;

/** All node types in the schema. */
export type NoteNode = BlockNode | ListItemNode | InlineNode;

/** Valid node type names. */
export const VALID_NODE_TYPES = [
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "text",
] as const;
export type NoteNodeType = (typeof VALID_NODE_TYPES)[number];

// ---------------------------------------------------------------------------
// NoteContent — the document AST
// ---------------------------------------------------------------------------

/**
 * ProseMirror-compatible document AST.
 * The root is always a "doc" node containing block-level content.
 */
export interface NoteContent {
  readonly type: "doc";
  readonly content: readonly BlockNode[];
}

// ---------------------------------------------------------------------------
// NoteDocument — full document with metadata and content
// ---------------------------------------------------------------------------

/**
 * A Note document combining metadata and rich-text content.
 * Type discriminator is always 'note'.
 */
export interface NoteDocument {
  readonly metadata: DocumentMetadata;
  readonly content: NoteContent;
}

// ---------------------------------------------------------------------------
// ProseMirror schema definition (type-only, no runtime dependency)
// ---------------------------------------------------------------------------

/**
 * Minimal ProseMirror schema definition for validation.
 * Describes the allowed node/mark structure without importing ProseMirror.
 */
export const NOTE_SCHEMA = {
  nodes: [
    "doc",
    "paragraph",
    "heading",
    "bulletList",
    "orderedList",
    "listItem",
    "text",
  ] as const,
  marks: ["bold", "italic", "link"] as const,
  topNode: "doc" as const,
} as const;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Validates a mark object. */
export function isValidMark(mark: NoteMark): boolean {
  if (!mark || typeof mark.type !== "string") return false;
  if (!VALID_MARK_TYPES.includes(mark.type as NoteMarkType)) return false;

  if (mark.type === "link") {
    const linkMark = mark as LinkMark;
    return (
      linkMark.attrs != null &&
      typeof linkMark.attrs.href === "string" &&
      linkMark.attrs.href.length > 0
    );
  }

  return true;
}

/** Validates a text node. */
export function isValidTextNode(node: TextNode): boolean {
  if (node.type !== "text") return false;
  if (typeof node.text !== "string" || node.text.length === 0) return false;
  if (node.marks !== undefined) {
    if (!Array.isArray(node.marks)) return false;
    return node.marks.every(isValidMark);
  }
  return true;
}

/** Validates an inline node. */
function isValidInlineNode(node: InlineNode): boolean {
  if (node.type === "text") return isValidTextNode(node);
  return false;
}

/** Validates that a heading level is between 1 and 6. */
export function isValidHeadingLevel(level: number): level is HeadingLevel {
  return Number.isInteger(level) && level >= 1 && level <= 6;
}

/** Validates a block node recursively. */
export function isValidBlockNode(node: BlockNode): boolean {
  switch (node.type) {
    case "paragraph":
      if (node.content !== undefined) {
        if (!Array.isArray(node.content)) return false;
        return node.content.every(isValidInlineNode);
      }
      return true;

    case "heading": {
      if (!node.attrs || !isValidHeadingLevel(node.attrs.level)) return false;
      if (node.content !== undefined) {
        if (!Array.isArray(node.content)) return false;
        return node.content.every(isValidInlineNode);
      }
      return true;
    }

    case "bulletList":
    case "orderedList":
      if (!Array.isArray(node.content) || node.content.length === 0)
        return false;
      return node.content.every(isValidListItemNode);

    default:
      return false;
  }
}

/** Validates a list item node. */
export function isValidListItemNode(node: ListItemNode): boolean {
  if (node.type !== "listItem") return false;
  if (!Array.isArray(node.content) || node.content.length === 0) return false;
  return node.content.every(isValidBlockNode);
}

/**
 * Validates a complete NoteContent AST.
 * Checks that the root is a "doc" node with valid block-level children.
 */
export function isValidNoteContent(content: NoteContent): boolean {
  if (!content || content.type !== "doc") return false;
  if (!Array.isArray(content.content)) return false;
  return content.content.every(isValidBlockNode);
}

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

/**
 * Creates an empty NoteContent with a single empty paragraph.
 * This is the default state for a new note.
 */
export function createEmptyContent(): NoteContent {
  return {
    type: "doc",
    content: [{ type: "paragraph" }],
  };
}

/** Options for creating a new NoteDocument. */
export interface CreateNoteDocumentOptions {
  /** Document identifier. */
  id: string;
  /** Server hosting the document. */
  server: string;
  /** Optional title (auto-generated if omitted). */
  title?: string;
  /** Optional creation date (defaults to now). */
  createdAt?: Date;
  /** Optional max devices override (default: 40). */
  maxDevices?: number;
  /** Optional initial content (defaults to empty content). */
  content?: NoteContent;
}

/**
 * Creates a new NoteDocument with validated metadata and content.
 *
 * @throws {Error} if any metadata field is invalid
 * @throws {Error} if content is provided and invalid
 */
export function createNoteDocument(
  options: CreateNoteDocumentOptions,
): NoteDocument {
  const { content = createEmptyContent(), ...rest } = options;

  if (!isValidNoteContent(content)) {
    throw new Error("Invalid note content: AST structure is not valid");
  }

  const docOptions: CreateDocumentOptions = {
    ...rest,
    type: "note",
  };

  const metadata = createDocument(docOptions);

  return {
    metadata,
    content,
  };
}
