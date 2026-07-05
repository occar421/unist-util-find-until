import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import { findAfterUntil } from "../src/index.ts";
import type { Heading, Paragraph, Root, RootContent } from "mdast";

const tree = {
  type: "root",
  children: [
    { type: "heading", depth: 1, children: [{ type: "text", value: "Title" }] },
    { type: "heading", depth: 2, children: [{ type: "text", value: "Sub-Title1" }] },
    { type: "paragraph", children: [{ type: "text", value: "alpha" }] },
    { type: "paragraph", children: [{ type: "text", value: "bravo" }] },
    { type: "paragraph", children: [{ type: "text", value: "charlie" }] },
    { type: "heading", depth: 2, children: [{ type: "text", value: "Sub-Title2" }] },
    { type: "paragraph", children: [{ type: "text", value: "delta" }] },
    { type: "paragraph", children: [{ type: "text", value: "echo" }] },
  ],
} as Root;

// @ts-ignore
// oxlint-disable-next-line no-unused-vars
const heading0 = tree.children[0];
// @ts-ignore
// oxlint-disable-next-line no-unused-vars
const heading1 = tree.children[1];
const paragraph0 = tree.children[2];
const paragraph1 = tree.children[3];
const paragraph2 = tree.children[4];
const heading2 = tree.children[5];
const paragraph3 = tree.children[6];
const paragraph4 = tree.children[7];

describe("findAfterUntil", () => {
  describe("Validation", () => {
    it("should throw if parent is nullish", () => {
      // @ts-expect-error: testing invalid input
      expect(() => findAfterUntil(null, 0, "paragraph")).toThrow("Expected parent node");
    });

    it("should throw if parent is not a node", () => {
      // @ts-expect-error: testing invalid input
      expect(() => findAfterUntil({}, 0, "paragraph")).toThrow("Expected parent node");
    });

    it("should throw if index is not a number or child node", () => {
      // @ts-expect-error: testing invalid input
      expect(() => findAfterUntil(tree, false, "paragraph")).toThrow(
        "Expected child node or index",
      );
    });

    it("should throw if index is a negative number", () => {
      expect(() => findAfterUntil(tree, -1, "paragraph")).toThrow(
        "Expected positive finite number as index",
      );
    });

    it("should throw if index is Infinity", () => {
      expect(() => findAfterUntil(tree, Number.POSITIVE_INFINITY, "paragraph")).toThrow(
        "Expected positive finite number as index",
      );
    });

    it("should throw if index is a node not in parent", () => {
      expect(() => findAfterUntil(tree, { type: "thematicBreak" }, "paragraph")).toThrow(
        "Expected child node or index",
      );
    });
  });

  describe("Basic Functionality", () => {
    it("should find nodes after index until predicate is met (using index)", () => {
      // index 2 is paragraph0
      // search starts from index 3 (paragraph1)
      // until paragraph3 (index 6)
      const result = findAfterUntil(tree, 2, (node) => node === paragraph3);
      expect(result).toEqual([paragraph1, paragraph2, heading2]);
    });

    it("should find nodes after child node until predicate is met", () => {
      const result = findAfterUntil(tree, paragraph0, (node) => node === paragraph3);
      expect(result).toEqual([paragraph1, paragraph2, heading2]);
    });

    it("should return all nodes after index if predicate is never met", () => {
      const result = findAfterUntil(tree, 6, "never-exists");
      expect(result).toEqual([paragraph4]);
    });

    it("should return empty array if predicate is met at next element", () => {
      // index 2 is paragraph0, next is paragraph1
      const result = findAfterUntil(tree, 2, "paragraph");
      expect(result).toEqual([]);
    });

    it("should filter nodes using test", () => {
      // start after index 0 (heading0)
      // heading1: 1 (odd)
      // paragraph0: 2 (even) -> included
      // paragraph1: 3 (odd)
      // paragraph2: 4 (even) -> included
      // heading2: 5 (odd)
      // paragraph3: 6 (even) -> included
      // paragraph4: 7 (stop)
      const result = findAfterUntil(
        tree,
        0,
        (node) => node === paragraph4,
        (_node, index) => typeof index === "number" && index % 2 === 0,
      );
      expect(result).toEqual([paragraph0, paragraph2, paragraph3]);
    });

    it("should return all nodes after index if test is omitted", () => {
      const result = findAfterUntil(tree, 2, paragraph3);
      expect(result).toEqual([paragraph1, paragraph2, heading2]);
    });
  });

  describe("unist-util-is compatibility", () => {
    it("should work with string test (type)", () => {
      const result = findAfterUntil(tree, 2, (node) => node === paragraph2, "paragraph");
      expect(result).toEqual([paragraph0, paragraph1]);
    });

    it("should work with object test (partial properties)", () => {
      const result = findAfterUntil(tree, 2, (node) => node === paragraph2, { type: "paragraph" });
      expect(result).toEqual([paragraph0, paragraph1]);
    });

    it("should work with function test", () => {
      const result = findAfterUntil(
        tree,
        2,
        (node) => node === paragraph2,
        (node) => node.type === "paragraph",
      );
      expect(result).toEqual([paragraph0, paragraph1]);
    });
  });

  describe("Types", () => {
    it("should have correct return type for number index", () => {
      let nodes = findAfterUntil(tree, 0, "paragraph");
      expectTypeOf(nodes).toEqualTypeOf<RootContent[]>();
    });

    it("should have correct return type for never matching test", () => {
      let paragraphs = findAfterUntil(tree, 0, "paragraph", "paragraph");
      expectTypeOf(paragraphs).toEqualTypeOf<Paragraph[]>();
    });

    it("should have correct return type for matching test", () => {
      let headings = findAfterUntil(tree, 0, "paragraph", "heading");
      expectTypeOf(headings).toEqualTypeOf<Heading[]>();
    });

    it("should have correct return type for node index", () => {
      let nodes = findAfterUntil(tree, paragraph0, "paragraph");
      expectTypeOf(nodes).toEqualTypeOf<RootContent[]>();
    });
  });
});
