import type { Node, Parent } from "unist";
import { convert, type Test } from "unist-util-is";

/**
 * Find nodes in `parent` starting from `index` until `untilPredicate` matches that pass `filterTest`.
 *
 * @param parent
 *   Parent node.
 * @param index
 *   Child node or index.
 * @param untilPredicate
 *   Test for child to stop at.
 * @param [filterTest]
 *   Test for child to look for (optional).
 * @returns
 *   Children (matching `filterTest`, if given).
 */
export function findUntil<
  Kind extends Parent,
  PredicateCheck extends Test,
  FilterCheck extends Test,
>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest: FilterCheck,
): Array<Matches<Child<Kind>, FilterCheck>>;
export function findUntil<Kind extends Parent, PredicateCheck extends Test>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest?: null,
): Array<Child<Kind>>;
export function findUntil<
  Kind extends Parent,
  PredicateCheck extends Test,
  FilterCheck extends Test,
>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest?: FilterCheck | null,
): Array<Node> {
  return findUntilInternal(parent, index, untilPredicate, filterTest, false);
}

/**
 * Find nodes in `parent` after `index` until `untilPredicate` matches that pass `filterTest`.
 *
 * @param parent
 *   Parent node.
 * @param index
 *   Child node or index.
 * @param untilPredicate
 *   Test for child to stop at.
 * @param [filterTest]
 *   Test for child to look for (optional).
 * @returns
 *   Children (matching `filterTest`, if given).
 */
export function findAfterUntil<
  Kind extends Parent,
  PredicateCheck extends Test,
  FilterCheck extends Test,
>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest: FilterCheck,
): Array<Matches<Child<Kind>, FilterCheck>>;
export function findAfterUntil<Kind extends Parent, PredicateCheck extends Test>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest?: null,
): Array<Child<Kind>>;
export function findAfterUntil<
  Kind extends Parent,
  PredicateCheck extends Test,
  FilterCheck extends Test,
>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest?: FilterCheck | null,
): Array<Node> {
  return findUntilInternal(parent, index, untilPredicate, filterTest, true);
}

/**
 * Collect nodes that can be parents of `Child`.
 */
type Child<Kind extends Node> = Kind extends Parent ? Kind["children"][number] : never;

/**
 * Get the value of a type guard `Fn`.
 */
type Predicate<Fn, Fallback> = Fn extends ((value: any) => value is infer Thing) ? Thing : Fallback;

/**
 * Check whether a node matches a primitive check in the type system.
 */
type MatchesOne<Value, Check> = Check extends null | undefined
  ? Value
  : Value extends {
        type: Check;
      }
    ? Value
    : Value extends Check
      ? Value
      : Check extends Function
        ? Predicate<Check, Value> extends Value
          ? Predicate<Check, Value>
          : never
        : never;

/**
 * Check whether a node matches a check in the type system.
 */
type Matches<Value, Check> =
  Check extends Array<any> ? MatchesOne<Value, Check[keyof Check]> : MatchesOne<Value, Check>;

function findUntilInternal<
  Kind extends Parent,
  PredicateCheck extends Test,
  FilterCheck extends Test,
>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest?: FilterCheck | null,
  after?: boolean,
): Array<Node> {
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

  const isPredicate = convert(untilPredicate);
  const isTest = filterTest === undefined ? () => true : convert(filterTest);

  const results: Node[] = [];
  for (let i = after ? start_index + 1 : start_index; i < parent.children.length; i++) {
    const child = parent.children[i];

    if (isPredicate(child, i, parent)) {
      break;
    }

    if (isTest(child, i, parent)) {
      results.push(child);
    }
  }

  return results;
}
