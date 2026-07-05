import { convert } from "unist-util-is";
//#region src/index.ts
function findUntil(parent, index, untilPredicate, filterTest) {
  return findUntilInternal(parent, index, untilPredicate, filterTest, false);
}
function findAfterUntil(parent, index, untilPredicate, filterTest) {
  return findUntilInternal(parent, index, untilPredicate, filterTest, true);
}
function findUntilInternal(parent, index, untilPredicate, filterTest, after) {
  if (!parent || !parent.type || !parent.children) throw new Error("Expected parent node");
  let start_index = -1;
  if (typeof index === "number") {
    if (index < 0 || index === Number.POSITIVE_INFINITY)
      throw new Error("Expected positive finite number as index");
    start_index = index;
  } else {
    start_index = parent.children.indexOf(index);
    if (start_index < 0) throw new Error("Expected child node or index");
  }
  const isPredicate = convert(untilPredicate);
  const isTest = filterTest === void 0 ? () => true : convert(filterTest);
  const results = [];
  for (let i = after ? start_index + 1 : start_index; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (isPredicate(child, i, parent)) break;
    if (isTest(child, i, parent)) results.push(child);
  }
  return results;
}
//#endregion
export { findAfterUntil, findUntil };
