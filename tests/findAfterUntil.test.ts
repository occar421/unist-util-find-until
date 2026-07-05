import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import { findAfterUntil } from "../src/index.ts";
import type { Paragraph, Root, RootContent } from "mdast";

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

const paragraph0 = tree.children[2];
const paragraph1 = tree.children[3];
const paragraph2 = tree.children[4];
const heading2 = tree.children[5];
const paragraph3 = tree.children[6];
const paragraph4 = tree.children[7];

describe("findAfterUntil", () => {
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
      // index 1: heading1
      // index 2: paragraph0
      // index 3: paragraph1
      // index 4: paragraph2
      // index 5: heading2
      // index 6: paragraph3
      // index 7: paragraph4 (stop)
      const result = findAfterUntil(
        tree,
        0,
        (node) => node === paragraph4,
        (node) => node.type === "paragraph",
      );
      expect(result).toEqual([paragraph0, paragraph1, paragraph2, paragraph3]);
    });
  });

  describe("Types", () => {
    it("should have correct return type for number index", () => {
      let nodes = findAfterUntil(tree, 0, "paragraph");
      expectTypeOf(nodes).toEqualTypeOf<RootContent[]>();
    });

    it("should have correct return type for matching test", () => {
      let paragraphs = findAfterUntil(tree, 0, "paragraph", "paragraph");
      expectTypeOf(paragraphs).toEqualTypeOf<Paragraph[]>();
    });
  });
});
