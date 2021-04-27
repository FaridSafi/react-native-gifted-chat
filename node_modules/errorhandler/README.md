# errorhandler

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Development-only error handler middleware.

This middleware is only intended to be used in a development environment, as
the _full error stack traces and internal details of any object passed to this
module_ will be sent back to the client when an error occurs.

When an object is provided to Express as an error, this module will display
as much about this object as possible, and will do so by using content negotiation
for the response between HTML, JSON, and plain text.

  * When the object is a standard `Error` object, the string provided by the
    `stack` property will be returned in HTML/text responses.
  * When the object is a non-`Error` object, the result of
    [util.inspect](https://nodejs.org/api/util.html#util_util_inspect_object_options)
    will be returned in HTML/text responses.
  * For JSON responses, the result will be an object with all enumerable properties
    from the object in the response.

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install errorhandler
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var errorhandler = require('errorhandler')
```

### errorhandler(options)

Create new middleware to handle errors and respond with content negotiation.

#### Options

Error handler accepts these properties in the options object.

##### log

Provide a function to be called with the error and a string representation of
the error. Can be used to write the error to any desired location, or set to
`false` to only send the error back in the response. Called as
`log(err, str, req, res)` where `err` is the `Error` object, `str` is a string
representation of the error, `req` is the request object and `res` is the
response object (note, this function is invoked _after_ the response has been
written).

The default value for this option is `true` unless `process.env.NODE_ENV === 'test'`.

Possible values:

  * `true`: Log errors using `console.error(str)`.
  * `false`: Only send the error back in the response.
  * A function: pass the error to a function for handling.

## Examples

### Simple example

Basic example of adding this middleware as the error handler only in development
with `connect` (`express` also can be used in this example).

```js
var connect = require('connect')
var errorhandler = require('errorhandler')

var app = connect()

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
}
```

### Custom output location

Sometimes you may want to output the errors to a different location than STDERR
during development, like a system notification, for example.

<!-- eslint-disable handle-callback-err -->

```js
var connect = require('connect')
var errorhandler = require('errorhandler')
var notifier = require('node-notifier')

var app = connect()

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler({ log: errorNotification }))
}

function errorNotification (err, str, req) {
  var title = 'Error in ' + req.method + ' ' + req.url

  notifier.notify({
    title: title,
    message: str
  })
}
```

## License

[MIT](LICENSE)

[coveralls-image]: https://badgen.net/coveralls/c/github/expressjs/errorhandler/master
[coveralls-url]: https://coveralls.io/r/expressjs/errorhandler?branch=master
[npm-downloads-image]: https://badgen.net/npm/dm/errorhandler
[npm-url]: https://npmjs.org/package/errorhandler
[npm-version-image]: https://badgen.net/npm/v/errorhandler
[travis-image]: https://badgen.net/travis/expressjs/errorhandler/master
[travis-url]: https://travis-ci.org/expressjs/errorhandler
