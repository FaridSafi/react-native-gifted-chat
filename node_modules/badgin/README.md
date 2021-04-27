# Badgin

The [Badging API](https://web.dev/badging-api/) is a new web platform API that allows installed web apps to set an application-wide badge, shown in an operating-system-specific place associated with the application (such as the shelf or home screen). Starting in Chrome 73, the Badging API is available as an origin trial for Windows (7+) and macOS. If you want to know how origin trials work, please check the[documentation](https://web.dev/badging-api/#ot). Since this API is not available everywhere, `badgin` safely falls back to alternatives.

## via badge

Currently, the native badge is only displayed if you install the web application to your home screen (view [prerequisites](https://developers.google.com/web/fundamentals/app-install-banners)). The screenshot shows the application in the dock of macOS.

![](https://github.com/jaulz/badgin/raw/master/assets/screenshots/standalone_osx.png)

## via favicon

If the native badge is not available, the favicon will be used and a small badge will be added.

![](https://github.com/jaulz/badgin/raw/master/assets/screenshots/favicon.png)

## via title

If the favicon is not available, the badge will be added as a prefix to the title.

![](https://github.com/jaulz/badgin/raw/master/assets/screenshots/title.png)

## Demo

You can find a demo at https://jaulz.github.io/badgin/ where you can see the different options. If you want to see the native badge, you need to install the app to your home screen (check out the plus icon in the address bar).

## Installation

The module can be installed by running:

```
yarn add --save badgin
```

## Usage

Just use the library as following:

```js
import badgin from 'badgin'

badgin.set(1) // set value
badgin.set() // set indicator only
badgin.clear()
```

### Options

The following options can be used:

```js
{
  method: 'Badging' | 'Favicon' | 'Title'
  favicon: {
    backgroundColor: string
    color: string
    indicator: string
  }
  title: {
    indicator: string
  }
}
```

And you can use it like this:

```js
badgin.set(1, {
  favicon: {
    width: 9,
    background: '#549A2F',
  },
})
```

## License / Credits

MIT

This is a refactored fork of the original Tinycon library, Tinycon is released under the MIT license. Tinycon was inspired by [Notificon](https://github.com/makeable/Notificon).
