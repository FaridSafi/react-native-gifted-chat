# @expo/vector-icons

This library is a compatibility layer around [@oblador/react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) to work with the Expo asset system. If you're using React Native without Expo, you have no need for this library -- carry on! (or maybe [check out Expo](https://expo.io/)).

> 👀: this library does *not* provide access to react-native-vector-icon's `Icon.getImageSource()` function for generating images from icons at runtime ([for context on why, see this issue](https://github.com/expo/vector-icons/issues/26)). If you find yourself needing an icon in the form of an image rather than text, you should generate that image yourself and bundle it with your app.

## Resources

- [@expo/vector-icons directory](https://expo.github.io/vector-icons/) - a searchable list of all included icons.
- [Font Awesome 5 icons directory](https://fontawesome.com/icons) - all Font Awesome 5 icons (including the Pro icons)
  ![Screenshot of website](https://raw.githubusercontent.com/expo/vector-icons/master/website-screenshot.png)
- [Expo documentation](https://docs.expo.io/)

## Usage

This library is part of the `expo` package, so if you are using `expo` you can simply use it like so

```tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default class IconExample extends React.Component {
  render() {
    return <Ionicons name="md-checkmark-circle" size={32} color="green" />;
  }
}
```

for more usage see [Expo icons documentation](https://docs.expo.io/versions/latest/guides/icons/)
