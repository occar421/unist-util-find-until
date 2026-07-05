import { Test } from "unist-util-is";
import { Node, Parent } from "unist";

//#region src/index.d.ts
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
declare function findUntil<
  Kind extends Parent,
  PredicateCheck extends Test,
  FilterCheck extends Test,
>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest: FilterCheck,
): Array<Matches<Child<Kind>, FilterCheck>>;
declare function findUntil<Kind extends Parent, PredicateCheck extends Test>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest?: null,
): Array<Child<Kind>>;
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
declare function findAfterUntil<
  Kind extends Parent,
  PredicateCheck extends Test,
  FilterCheck extends Test,
>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest: FilterCheck,
): Array<Matches<Child<Kind>, FilterCheck>>;
declare function findAfterUntil<Kind extends Parent, PredicateCheck extends Test>(
  parent: Kind,
  index: Child<Kind> | number,
  untilPredicate: PredicateCheck,
  filterTest?: null,
): Array<Child<Kind>>;
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
//#endregion
export { findAfterUntil, findUntil };
