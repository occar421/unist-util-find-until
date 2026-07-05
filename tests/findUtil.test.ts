import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import { findUntil } from "../src/index.ts";
import type { Node, Parent } from "unist";

interface Heading extends Node {
  type: "heading";
  depth: number;
  value: string;
}

interface Paragraph extends Node {
  type: "paragraph";
  children: (Node | Text)[];
}

interface Text extends Node {
  type: "text";
  value: string;
}

const heading0 = { type: "heading", depth: 1, value: "Title" } as Heading;
const heading1 = { type: "heading", depth: 2, value: "Sub-Title1" } as Heading;
const paragraph0 = { type: "paragraph", children: [{ type: "text", value: "alpha" }] } as Paragraph;
const paragraph1 = { type: "paragraph", children: [{ type: "text", value: "bravo" }] } as Paragraph;
const paragraph2 = {
  type: "paragraph",
  children: [{ type: "text", value: "charlie" }],
} as Paragraph;
const heading2 = { type: "heading", depth: 2, value: "Sub-Title2" } as Heading;
const paragraph3 = { type: "paragraph", children: [{ type: "text", value: "delta" }] } as Paragraph;
const paragraph4 = { type: "paragraph", children: [{ type: "text", value: "echo" }] } as Paragraph;

const tree = {
  type: "root",
  children: [
    heading0,
    heading1,
    paragraph0,
    paragraph1,
    paragraph2,
    heading2,
    paragraph3,
    paragraph4,
  ] as (Heading | Paragraph)[],
} as Parent;

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
      expect(() => findUntil(tree, { type: "text" }, "paragraph")).toThrow(
        "Expected child node or index",
      );
    });
  });

  describe("Basic Functionality", () => {
    it("should find nodes until predicate is met (using index)", () => {
      const result = findUntil(tree, 2, (node: Node) => node === paragraph3);
      expect(result).toEqual([paragraph0, paragraph1, paragraph2, heading2]);
    });

    it("should find nodes until predicate is met (using child node)", () => {
      const result = findUntil(tree, paragraph0, (node: Node) => node === paragraph3);
      expect(result).toEqual([paragraph0, paragraph1, paragraph2, heading2]);
    });

    it("should return all nodes from index if predicate is never met", () => {
      const result = findUntil(tree, 6, "never-exists");
      expect(result).toEqual([paragraph3, paragraph4]);
    });

    it("should return empty array if predicate is met at start index", () => {
      const result = findUntil(tree, 2, "paragraph");
      expect(result).toEqual([]);
    });

    it("should filter nodes using test", () => {
      // heading0: 0 (even) -> included
      // heading1: 1 (odd)
      // paragraph0: 2 (even) -> included
      // paragraph1: 3 (odd)
      // paragraph2: 4 (even) -> included
      // heading2: 5 (odd)
      // paragraph3: 6 (even) -> included
      // paragraph4: 7 (stop)
      const result = findUntil(
        tree,
        0,
        (node: Node) => node === paragraph4,
        (_node: Node, index) => typeof index === "number" && index % 2 === 0,
      );
      expect(result).toEqual([heading0, paragraph0, paragraph2, paragraph3]);
    });

    it("should return all nodes from index if test is omitted", () => {
      const result = findUntil(tree, 2, paragraph3);
      expect(result).toEqual([paragraph0, paragraph1, paragraph2, heading2]);
    });
  });

  describe("unist-util-is compatibility", () => {
    it("should work with string test (type)", () => {
      const result = findUntil(tree, 2, (node: Node) => node === paragraph2, "paragraph");
      expect(result).toEqual([paragraph0, paragraph1]);
    });

    it("should work with object test (partial properties)", () => {
      const result = findUntil(tree, 2, (node: Node) => node === paragraph2, { type: "paragraph" });
      expect(result).toEqual([paragraph0, paragraph1]);
    });

    it("should work with function test", () => {
      const result = findUntil(
        tree,
        2,
        (node: Node) => node === paragraph2,
        (node: Node) => node.type === "paragraph",
      );
      expect(result).toEqual([paragraph0, paragraph1]);
    });
  });

  describe("Types", () => {
    it("should have correct return type", () => {
      expectTypeOf(findUntil(tree, 0, "paragraph")).toEqualTypeOf<Node[]>();
      expectTypeOf(findUntil(tree, 0, "paragraph", "paragraph")).toEqualTypeOf<never[]>();

      const paragraph = tree.children[0];
      expectTypeOf(findUntil(tree, paragraph, "paragraph")).toEqualTypeOf<Node[]>();
    });
  });
});
