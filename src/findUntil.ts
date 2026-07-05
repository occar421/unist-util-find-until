import type { Child, Matches, Node, Parent, Test } from "./types.ts";
import { convert } from "unist-util-is";

export function findUntil<Kind extends Parent, Check extends Test, Predicate extends Test>(
  parent: Kind,
  index: number | Child<Kind>,
  predicate: Predicate,
  test?: Check,
): Array<Matches<Child<Kind>, Check>> {
  if (!parent || !parent.type || !parent.children) {
    throw new Error("Expected parent node");
  }

  let start_index = -1;
  if (typeof index === "number") {
    if (index < 0 || index === Number.POSITIVE_INFINITY) {
      throw new Error("Expected positive finite number as index");
    }
    start_index = index;
  } else {
    start_index = parent.children.indexOf(index);

    if (start_index < 0) {
      throw new Error("Expected child node or index");
    }
  }

  const isPredicate = convert(predicate);
  const isTest = test === undefined ? () => true : convert(test);

  const results: Node[] = [];
  for (let i = start_index; i < parent.children.length; i++) {
    const child = parent.children[i];

    if (isPredicate(child, i, parent)) {
      break;
    }

    if (isTest(child, i, parent)) {
      results.push(child);
    }
  }

  return results as Array<Matches<Child<Kind>, Check>>;
}
