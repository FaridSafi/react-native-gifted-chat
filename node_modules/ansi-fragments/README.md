# ansi-fragments

[![Version][version]][package]   

[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![MIT License][license-badge]][license]
[![Chat][chat-badge]][chat]
[![Code of Conduct][coc-badge]][coc]

A tiny library with builders to help making logs/CLI pretty with a nice DX.

- [ansi-fragments](#ansi-fragments)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
      - [`color`](#color)
      - [`modifier`](#modifier)
      - [`container`](#container)
      - [`pad`](#pad)
      - [`fixed`](#fixed)
      - [`ifElse`](#ifElse)
      - [`provide`](#provide)

## Installation

```bash
yarn add ansi-fragments
```

## Usage

```js
import { color, modifier, pad, container } from 'ansi-fragments';

const prettyLog = (level, message) => container(
  color('green', modifier('italic', level)),
  pad(1),
  message
).build();

console.log(prettyLog('success', 'Yay!'));
```

## API

Each fragment implements `IFragment` interface:

```ts
interface IFragment {
  build(): string;
}
```

The `build` method is responsible for traversing the tree of fragments and create a string representation with ANSI escape codes.


#### `color`

```ts
color(
  ansiColor: AnsiColor,
  ...children: Array<string | IFragment>
): IFragment
```

Creates fragment for standard ANSI [colors](./src/fragments/Color.ts).

```js
color('red', 'Oh no');
color('bgBlue', color('brightBlue', 'Hey'));
color('green', modifier('bold', 'Sup!'));
```

#### `modifier`

```ts
modifier(
  ansiModifier: AnsiModifier,
  ...children: Array<string | IFragment>
): IFragment
```

Creates fragment for standard ANSI [modifiers](./src/fragments/Modifier.ts): `dim`, `bold`, `hidden`, `italic`, `underline`, `strikethrough`.

```js
modifier('underline', 'Hello', 'World');
modifier('italic', modifier('bold', 'Hey'));
modifier('bold', color('green', 'Sup!'));
```

#### `container`

```ts
container(...children: Array<string | IFragment>): IFragment
```

Creates fragment, which sole purpose is to hold and build nested fragments.

```js
container(
  color('gray', '[08/01/18 12:00]'),
  pad(1),
  color('green', 'success'),
  pad(1),
  'Some message'
)
```

#### `pad`

```ts
pad(count: number, separator?: string): IFragment
```

Creates fragment, which repeats given separator (default: ` `) given number of times.

```js
pad(1);
pad(2, '#')
pad(1, '\n')
```

#### `fixed`

```ts
fixed(
  value: number,
  bias: 'start' | 'end',
  ...children: Array<string | IFragment>
): IFragment
```

Creates fragment, which makes sure the children will always build to given number of non-ANSI characters. It will either trim the results or add necessary amount of spaces. The `bias` control if trimming/padding should be done at the start of the string representing built children or at the end.

```js
fixed(5, 'start', 'ERR'); // => '  ERR'
fixed(8, 'end', color('green', 'success')); // equals to color('green', 'success') + ' '
fixed(10, 'end', 'Hello', pad(2), 'World') // => 'Hello  Wor'
```

#### `ifElse`

```ts
ifElse(
  condition: Condition,
  ifTrueFragment: string | IFragment,
  elseFragment: string | IFragment
): IFragment

type ConditionValue = boolean | string | number | null | undefined;
type Condition = ConditionValue | (() => ConditionValue);
```

Change the output based on condition. Condition can ba a primitive value, which can be casted to boolean or a function. If conation or return value of condition is evaluated to `true`, the first argument - `ifTrueFragment` will be used, otherwise `elseFragment`.

```js
let condition = getConditionValue()
ifElse(
  () => condition,
  color('red', 'ERROR'),
  color('yellow', 'WARNING')
)
```

#### `provide`

```ts
provide<T>(
  value: T,
  builder: (value: T) => string | IFragment
): IFragment
```

Provides given value to a builder function, which should return `string` or fragment. Useful in situations when the output is connected with some calculated value - using `provide` you only need to calculate final value once and forward it to custom styling logic.

```js
provide(getMessageFromSomewhere(), value => {
  switch (value.level) {
    case 'error':
      return container(
        color('red', modifier('bold', value.level.toUpperCase())),
        pad(2),
        value.log
      );
    case 'info':
      return container(
        color('blue', value.level.toUpperCase()),
        pad(2),
        value.log
      );
    default:
      return container(value.level.toUpperCase(), pad(2), value.log);
  }
})
```


<!-- badges (common) -->

[license-badge]: https://img.shields.io/npm/l/ansi-fragments.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/zamotany/ansi-fragments/blob/master/CODE_OF_CONDUCT.md
[chat-badge]: https://img.shields.io/badge/chat-discord-brightgreen.svg?style=flat-square&colorB=7289DA&logo=discord
[chat]: https://discord.gg/zwR2Cdh

[version]: https://img.shields.io/npm/v/ansi-fragments.svg?style=flat-square
[package]: https://www.npmjs.com/package/ansi-fragments
