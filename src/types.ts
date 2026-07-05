import type { Node, Parent } from "unist";
import type { Test as UnistUtilIsTest } from "unist-util-is";

export type { Node, Parent };

export type Child<Kind extends Node> = Kind extends Parent ? Kind["children"][number] : never;
export type Test = Exclude<UnistUtilIsTest, undefined> | undefined;

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
export type Matches<Value, Check> =
  Check extends Array<any> ? MatchesOne<Value, Check[keyof Check]> : MatchesOne<Value, Check>;
