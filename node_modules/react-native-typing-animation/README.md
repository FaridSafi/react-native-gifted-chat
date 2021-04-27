<p align="center">
  <img src="https://user-images.githubusercontent.com/3059371/49334754-3c9dfe00-f5ab-11e8-8885-0192552d12a1.gif" alt="example" height="150"/>
</p>
<h3 align="center">
  💬 React Native Typing Animation
</h3>
<p align="center">
  A typing animation for your React Native chat app<br/>
  based on <a href="https://uxdesign.cc/how-you-can-use-simple-trigonometry-to-create-better-loaders-32a573577eb4">simple trigonometry</a> to create better loaders.
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/react-native-typing-animation">
    <img alt="npm version" src="https://badge.fury.io/js/react-native-typing-animation.svg"/>
  </a>
  <a href="https://circleci.com/gh/watadarkstar/react-native-typing-animation"><img src="https://circleci.com/gh/watadarkstar/react-native-typing-animation.svg?style=shield" alt="build"></a>
  <a title='License' href="https://github.com/watadarkstar/react-native-typing-animation/blob/master/LICENSE" height="18">
    <img src='https://img.shields.io/badge/license-MIT-blue.svg' />
  </a>
  <a title='Tweet' href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20React%20Native%20typing%20animation%20made%20with%20simple%20trigonometry&url=https://github.com/watadarkstar/react-native-typing-animation&via=icookandcode&hashtags=react,reactnative,opensource,github,ux" height="18">
    <img src='https://img.shields.io/twitter/url/http/shields.io.svg?style=social' />
  </a>
</p>

## Features

* Smooth movement
* Customizable
* No dependencies
* Fast, lightweight and no images
* Uses `requestAnimationFrame`

## Installation

* Using [npm](https://www.npmjs.com/#getting-started): `npm install react-native-typing-animation --save`
* Using [Yarn](https://yarnpkg.com/): `yarn add react-native-typing-animation`

## Example

```jsx
import React from "react";
import { TypingAnimation } from 'react-native-typing-animation';

class Example extends React.Component {
  render() {
    return (
      <TypingAnimation />
    );
  }
}
```

## Advanced Example

```jsx
import React from "react";
import { TypingAnimation } from 'react-native-typing-animation';

class Example extends React.Component {
  render() {
    return (
      <TypingAnimation 
        dotColor="black"
        dotMargin={3}
        dotAmplitude={3}
        dotSpeed={0.15}
        dotRadius={2.5}
        dotX={12}
        dotY={6}
      />
    );
  }
}
```

## Props

* **`style`** _(Object)_ - Container styles; default is `{}`
* **`dotColor`** _(String)_ - Dot color; default is `#000` (black)
* **`dotStyles`** _(Object)_ - Dot styles; default is `{}`
* **`dotRadius`** _(Integer)_ - Dot radius; default is `2.5`
* **`dotMargin`** _(Integer)_ - Dot margin, the space between dots; default is `3`
* **`dotAmplitude`** _(Integer)_ - Dot amplitude; default is `3`
* **`dotSpeed`** _(Integer)_ - Dot speed; default is `0.15`
* **`dotY`** _(Integer)_ - Dot y, the starting y coordinate; default is `6`
* **`dotX`** _(Integer)_ - Dot x, the x coordinate of the center dot; default is `12`

## License

* [MIT](LICENSE)

## Author

Feel free to ask me questions on Twitter [@icookandcode](https://www.twitter.com/icookandcode)!

## Credits

Work is based on the amazing article ["How you can use simple Trigonometry to create better loaders"](https://uxdesign.cc/how-you-can-use-simple-trigonometry-to-create-better-loaders-32a573577eb4) by Nash Vail

## Contributors
* [Dennis Murage](https://github.com/murageden)

Submit a PR to contribute :)

## Roadmap

* Move from `requestAnimationFrame` to `Animated` with `useNativeDriver` (PRs welcome)
* Integrate with Gifted Chat
* Unit tests (PRs welcome)

## Release

We use `release-it`, to release do the following:

```
yarn run release:dry
yarn run release
```

## Changelog
* Allow animation speed to be configurable
