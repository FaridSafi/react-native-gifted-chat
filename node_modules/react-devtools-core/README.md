# `react-devtools-core`

A standalone React DevTools implementation.  

This is a low-level package.  
**If you're looking for the Electron app you can run, use `react-devtools` package instead.**

## Exports

## `require('react-devtools-core').connectToDevTools(options)`

This is similar to `require('react-devtools')` in another package but providing more control.  
Unlike `require('react-devtools')`, it doesn't connect immediately, but exports a function.

Run `connectToDevTools()` in the same context as React to set up a connection to DevTools.  
Make sure this runs *before* any `react`, `react-dom`, or `react-native` imports.

The `options` object may contain:

* `host` (string), defaults to `'localhost'`.
* `port` (number), defaults to `8097`.
* `resolveRNStyle` (function), used by RN and `null` by default.

None of the options are required.

## `require('react-devtools-core/standalone')`

Lets you render DevTools into a DOM node and have it listen to connections.

For example:

```js
require('react-devtools-core/standalone')
  .setContentDOMNode(document.getElementById('container'))
  .startServer(port);
```

You can check the Electron shell in `react-devtools` package for a complete integration example.
