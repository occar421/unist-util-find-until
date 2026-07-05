import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import { findUntil } from "../src/index.ts";
import type { Node, Parent } from "unist";

const tree = {
  type: "root",
  children: [
    { type: "paragraph", children: [{ type: "text", value: "alpha" }] },
    { type: "paragraph", children: [{ type: "text", value: "bravo" }] },
    { type: "paragraph", children: [{ type: "text", value: "charlie" }] },
    { type: "paragraph", children: [{ type: "text", value: "delta" }] },
    { type: "paragraph", children: [{ type: "text", value: "echo" }] },
  ],
} as any as Parent;

const paragraph0 = tree.children[0];
const paragraph1 = tree.children[1];
const paragraph2 = tree.children[2];
const paragraph3 = tree.children[3];
const paragraph4 = tree.children[4];

describe("findUntil", () => {
  describe("Validation", () => {
    it("should throw if parent is nullish", () => {
      // @ts-expect-error: testing invalid input
      expect(() => findUntil(null, 0, "paragraph")).toThrow("Expected parent node");
    });

    it("should throw if parent is not a node", () => {
      // @ts-expect-error: testing invalid input
      expect(() => findUntil({}, 0, "paragraph")).toThrow("Expected parent node");
    });

    it("should throw if index is not a number or child node", () => {
      // @ts-expect-error: testing invalid input
      expect(() => findUntil(tree, false, "paragraph")).toThrow("Expected child node or index");
    });

    it("should throw if index is a negative number", () => {
      expect(() => findUntil(tree, -1, "paragraph")).toThrow(
        "Expected positive finite number as index",
      );
    });

    it("should throw if index is Infinity", () => {
      expect(() => findUntil(tree, Number.POSITIVE_INFINITY, "paragraph")).toThrow(
        "Expected positive finite number as index",
      );
    });

    it("should throw if index is a node not in parent", () => {
      expect(() => findUntil(tree, { type: "text" } as any, "paragraph")).toThrow(
        "Expected child node or index",
      );
    });
  });

  describe("Basic Functionality", () => {
    it("should find nodes until predicate is met (using index)", () => {
      const result = findUntil(
        tree,
        1,
        (node: Node) => node === paragraph3,
        () => true,
      );
      expect(result).toEqual([paragraph1, paragraph2]);
    });

    it("should find nodes until predicate is met (using child node)", () => {
      const result = findUntil(
        tree,
        paragraph1,
        (node: Node) => node === paragraph3,
        () => true,
      );
      expect(result).toEqual([paragraph1, paragraph2]);
    });

    it("should return all nodes from index if predicate is never met", () => {
      const result = findUntil(tree, 3, "never-exists", () => true);
      expect(result).toEqual([paragraph3, paragraph4]);
    });

    it("should return empty array if predicate is met at start index", () => {
      const result = findUntil(tree, 1, "paragraph", () => true);
      expect(result).toEqual([]);
    });

    it("should filter nodes using test", () => {
      // Paragraph 1 and 3 are at index 1 and 3.
      // We start at 0, until we hit paragraph 4.
      // We only want even indices (0, 2).
      const result = findUntil(
        tree,
        0,
        (node: Node) => node === paragraph4,
        ((_node: Node, index: number) => index % 2 === 0) as any,
      );
      expect(result).toEqual([paragraph0, paragraph2]);
    });

    it("should return all nodes from index if test is omitted", () => {
      const result = findUntil(tree, 1, paragraph3);
      expect(result).toEqual([paragraph1, paragraph2]);
    });
  });

  describe("unist-util-is compatibility", () => {
    it("should work with string test (type)", () => {
      const result = findUntil(tree, 0, (node: Node) => node === paragraph2, "paragraph");
      expect(result).toEqual([paragraph0, paragraph1]);
    });

    it("should work with object test (partial properties)", () => {
      const result = findUntil(tree, 0, (node: Node) => node === paragraph2, { type: "paragraph" });
      expect(result).toEqual([paragraph0, paragraph1]);
    });

    it("should work with function test", () => {
      const result = findUntil(
        tree,
        0,
        (node: Node) => node === paragraph2,
        (node: Node) => node.type === "paragraph",
      );
      expect(result).toEqual([paragraph0, paragraph1]);
    });
  });

  describe("Types", () => {
    it("should have correct return type", () => {
      expectTypeOf(findUntil(tree, 0, "paragraph")).toEqualTypeOf<Node[]>();
      let nevers = findUntil(tree, 0, "paragraph", "paragraph");
      expectTypeOf(nevers).toEqualTypeOf<Node[]>();

      const paragraph = tree.children[0];
      expectTypeOf(findUntil(tree, paragraph as any, "paragraph")).toEqualTypeOf<Node[]>();
    });
  });
});
