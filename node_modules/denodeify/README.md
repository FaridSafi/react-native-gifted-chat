denodeify [ ![Codeship Status for matthew-andrews/denodeify](https://codeship.io/projects/02ac77d0-1a58-0132-bf86-4a07366ee29d/status)](https://codeship.io/projects/34622)
=========

Tool to turn functions with Node-style callback APIs into functions that return [Promises](https://github.com/jakearchibald/es6-promise).

Inspired by and adapted from Q's [`Q.denodeify`/`Q.nfcall` function](https://github.com/kriskowal/q/wiki/API-Reference#qnfbindnodefunc-args).

Warning: This micro-library doesn't force you to use any particular Promise implementation by using whatever `Promise` has been defined as globally.  This is so that you may use any ES6 standard Promise compliant library - or, of course, native ES6 Promises.

If you're running the code on a browser or node version that doesn't include native promises you will need to include a polyfill.  The following polyfills are tested as part of this module's test suite:-
- [Jake Archibald](https://twitter.com/jaffathecake)'s [ES6 Promise library](https://github.com/jakearchibald/es6-promise) (which is actually adapted from [Stefan Penner](https://twitter.com/stefanpenner)'s [RSVP.js](https://github.com/tildeio/rsvp.js)). -  `require('es6-promise').polyfill();`
- [Getify](https://twitter.com/getify)'s [Native Promise Only library](https://github.com/getify/native-promise-only) - `require('native-promise-only');`
- [ES6 Shim](https://github.com/es-shims/es6-shim) - `require('es6-shim');`
- [Calvin Metcalf](https://twitter.com/CWMma)'s [Lie](https://github.com/calvinmetcalf/lie) - `global.Promise = global.Promise || require('lie');`

Note: as of v1.2.0 you can use **denodeify** in the front end.  Pull it in via CommonJS, AMD or simply add to your webpage and it'll be available on `window.denodeify`. 

## Installation

```
npm install denodeify --save
```

Or:-

```
bower install denodeify --save
```

## Examples

Simple example with [`readFile`](https://www.npmjs.org/package/read-file):-

```js
require('es6-promise').polyfill();

var denodeify = require('denodeify');
var readFile = denodeify(require('fs').readFile);

readFile('my-file.txt', { encoding: 'UTF-8' })
  .then(function(text) {
    console.log("My file's contents is: " + text);
  });
```

(Note: you will need to also install [es6-promise](https://github.com/jakearchibald/es6-promise) with `npm install es6-promise` for this code sample to work within node versions that don't have `Promise` natively available)

More complex example with `exec`:-

## Advanced usage

You can also pass in a function as a second argument of `denodeify` that allows you to manipulate the data returned by the wrapped function before it gets passed to the Promise's `reject` or `resolve` functions, for example:-

```js
require('es6-promise').polyfill();

var denodeify = require('denodeify');
var exec = denodeify(require('child_process').exec, function(err, stdout, stderr) {

  // Throw away stderr data
  return [err, stdout];
});

exec('hostname')
  .then(function(host) {
    console.log("My hostname is: " + host.replace('\n', ''));
  });
```

Or,

```js
require('es6-promise').polyfill();

var denodeify = require('denodeify');
var exec = denodeify(require('child_process').exec, function(err, stdout, stderr) {
  return [err, [stdout, stderr]];
});

exec('my-command')
  .then(function(results) {
    console.log("stdout is: " + results[0]);
    console.log("stderr is: " + results[1]);
  });
```

Useful for functions that return multiple arguments, for example [`child_process#exec`](http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback).

## Credits and collaboration ##

The lead developer of **denodeify** is [Matt Andrews](http://twitter.com/andrewsmatt) at FT Labs with much help and support from [Kornel Lesiński](https://twitter.com/pornelski). All open source code released by FT Labs is licenced under the MIT licence. We welcome comments, feedback and suggestions.  Please feel free to raise an issue or pull request.
