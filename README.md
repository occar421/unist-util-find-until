# unist-util-find-until

[![Build][build-badge]][build]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

[unist][] utility to find nodes until condition met.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`findUntil(parent, index, untilPredicate[, filterTest])`](#finduntilparent-index-untilpredicate-filtertest)
  - [`findAfterUntil(parent, index, untilPredicate[, filterTest])`](#findafteruntilparent-index-untilpredicate-filtertest)
- [Types](#types)
- [Compatibility](#compatibility)
- [Related](#related)
- [Contribute](#contribute)
- [License](#license)

## What is this?

This is a tiny utility that you can use to find nodes in a parent until a condition is met.

## When should I use this?

This utility removes this kind of code.

```js
const nextSegment = findAfter(parent, segment, "segment");
const targetNodes = nextSegment
  ? findBetween(parent, segment, nextSegment)
  : findAllAfter(parent, segment);
```

This should be written as:

```js
const targetNodes = findAfterUntil(parent, segment, "segment");
```

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install unist-util-find-until
```

## Use

```js
import { u } from "unist-builder";
import { findUntil, findAfterUntil } from "unist-util-find-until";

const tree = u("tree", [
  u("leaf", "leaf 1"),
  u("parent", [u("leaf", "leaf 2"), u("leaf", "leaf 3")]),
  u("leaf", "leaf 4"),
  u("parent", [u("leaf", "leaf 5")]),
  u("leaf", "leaf 6"),
  u("empty"),
  u("leaf", "leaf 7"),
]);

console.log(findUntil(tree, 2, "empty"));
// [
//   {type: 'leaf', value: 'leaf 4'},
//   {type: 'parent', children: [{type: 'leaf', value: 'leaf 5'}]},
//   {type: 'leaf', value: 'leaf 6'}
// ]

console.log(findAfterUntil(tree, 2, "empty", "leaf"));
// [
//   {type: 'leaf', value: 'leaf 6'}
// ]
```

## API

This package exports the identifiers [`findUntil`][api-find-until] and [`findAfterUntil`][api-find-after-until].
There is no default export.

### `findUntil(parent, index, untilPredicate[, filterTest])`

Find nodes in `parent` starting from `index` (inclusive) until `untilPredicate` matches.
If `filterTest` is given, only nodes that pass it are returned.

### `findAfterUntil(parent, index, untilPredicate[, filterTest])`

Find nodes in `parent` after `index` (exclusive) until `untilPredicate` matches.
If `filterTest` is given, only nodes that pass it are returned.

###### Parameters

- `parent` ([`Node`][node])
  — parent node
- `index` ([`Node`][node] or `number`)
  — child node or index in `parent`
- `untilPredicate` ([`Test`][test])
  — `unist-util-is`-compatible test to stop at
- `filterTest` ([`Test`][test], optional)
  — `unist-util-is`-compatible test for nodes to include

###### Returns

Children of `parent` ([`Array<Node>`][node]).

## Types

This package is fully typed with [TypeScript][].
It exports no additional types (types for the test are in `unist-util-is`).

## Compatibility

When we cut a new major release, we drop support for unmaintained versions of
Node.

## Related

- [`unist-util-find-after`](https://github.com/syntax-tree/unist-util-find-after)
  — find a node after another node
- [`unist-util-find-all-after`](https://github.com/syntax-tree/unist-util-find-all-after)
  — find all nodes after another node
- [`unist-util-find-between`](https://github.com/ipikuka/unist-util-find-between)
  — find the nodes between two nodes

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [MasuqaT][author]

[build-badge]: https://github.com/occar421/unist-util-find-until/actions/workflows/main.yml/badge.svg
[build]: https://github.com/occar421/unist-util-find-until/actions
[downloads-badge]: https://img.shields.io/npm/dm/unist-util-find-until.svg
[downloads]: https://www.npmjs.com/package/unist-util-find-until
[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=unist-util-find-until
[size]: https://bundlejs.com/?q=unist-util-find-until
[npm]: https://docs.npmjs.com/cli/install
[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[typescript]: https://www.typescriptlang.org
[license]: LICENSE
[author]: https://github.com/occar421
[health]: https://github.com/syntax-tree/.github
[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md
[support]: https://github.com/syntax-tree/.github/blob/main/support.md
[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md
[unist]: https://github.com/syntax-tree/unist
[node]: https://github.com/syntax-tree/unist#node
[test]: https://github.com/syntax-tree/unist-util-is#test
[api-find-until]: #finduntilparent-index-untilpredicate-filtertest
[api-find-after-until]: #findafteruntilparent-index-untilpredicate-filtertest
