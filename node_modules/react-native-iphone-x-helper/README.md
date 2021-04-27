[![npm version](https://badge.fury.io/js/react-native-iphone-x-helper.svg)](https://badge.fury.io/js/react-native-iphone-x-helper)

# react-native-iphone-x-helper
A library to help you design your react-native app for notched iPhones.

## Installing ##
`npm i react-native-iphone-x-helper --save`

## API ##

### ifIphoneX(iphoneXStyle, \[regularStyle\]) ###
this method it for creating stylesheets with the iPhone X in mind

#### Parameters ####
**iphoneXStyle** - the style to apply if you're on iPhone X

**regularStyle (*optional*)** - the style to apply if you're not on iPhone X

#### Example ####
```js
// in style.js

import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default StyleSheet.create({
    header:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding:10,
        height: 60,
        backgroundColor: 'transparent',
        ...ifIphoneX({
            paddingTop: 50
        }, {
            paddingTop: 20
        })
    },
});
```

### isIphoneX() ###

**returns** - `true` if you running on an iPhone X.

#### Example ####
```js
import { isIphoneX } from 'react-native-iphone-x-helper'

// ...

if (isIphoneX()) {
    // do this...
} else {
    // do that...
}
```

### getStatusBarHeight([safe]) ###

#### Parameters ####
**safe** - whether you want for get safe area height or not

**returns** - the height of the status bar: `44` for safe iPhoneX, `30` for unsafe iPhoneX, `20` for other iOS devices and `StatusBar.currentHeight` for Android.

#### Example ####

```js
// in style.js

import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export default StyleSheet.create({
    header:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding:10,
        height: 60,
        backgroundColor: 'transparent',
        paddingTop: getStatusBarHeight()
    },
});
```

***NOTE:*** If your using the the unsafe statusbar height, make sure to add 14dp of padding to your content, otherwise it's going to be flush against the notch

### getBottomSpace ###

**returns** - the height of the bottom to fit the safe area: `34` for iPhone X and `0` for other devices.

#### Example ####

```js
// in style.js

import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper'

export default StyleSheet.create({
    totalview: {
        flex: 1,
        backgroundColor: 'transparent',
        marginBottom: getBottomSpace()
    },
});
```

## Licence ##
**MIT**
