# JavaScript MD5

## Contents

- [Demo](#demo)
- [Description](#description)
- [Usage](#usage)
  - [Client-side](#client-side)
  - [Server-side](#server-side)
- [Requirements](#requirements)
- [API](#api)
- [Tests](#tests)
- [License](#license)

## Demo

[JavaScript MD5 Demo](https://blueimp.github.io/JavaScript-MD5/)

## Description

JavaScript MD5 implementation. Compatible with server-side environments like
Node.js, module loaders like RequireJS, Browserify or webpack and all web
browsers.

## Usage

### Client-side

Include the (minified) JavaScript [MD5](https://en.wikipedia.org/wiki/MD5)
script in your HTML markup:

```html
<script src="js/md5.min.js"></script>
```

In your application code, calculate the
([hex](https://en.wikipedia.org/wiki/Hexadecimal)-encoded)
[MD5](https://en.wikipedia.org/wiki/MD5) hash of a string by calling the **md5**
method with the string as argument:

```js
var hash = md5('value') // "2063c1608d6e0baf80249c42e2be5804"
```

### Server-side

The following is an example how to use the JavaScript MD5 module on the
server-side with [Node.js](http://nodejs.org/).

Create a new directory and add the **md5.js** file. Or alternatively, install
the **blueimp-md5** package with [npm](https://www.npmjs.org/):

```sh
npm install blueimp-md5
```

Add a file **server.js** with the following content:

```js
require('http')
  .createServer(function(req, res) {
    // The md5 module exports the md5() function:
    var md5 = require('./md5'),
      // Use the following version if you installed the package with npm:
      // var md5 = require("blueimp-md5"),
      url = require('url'),
      query = url.parse(req.url).query
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    // Calculate and print the MD5 hash of the url query:
    res.end(md5(query))
  })
  .listen(8080, 'localhost')
console.log('Server running at http://localhost:8080/')
```

Run the application with the following command:

```sh
node server.js
```

## Requirements

The JavaScript MD5 script has zero dependencies.

## API

Calculate the ([hex](https://en.wikipedia.org/wiki/Hexadecimal)-encoded)
[MD5](https://en.wikipedia.org/wiki/MD5) hash of a given string value:

```js
var hash = md5('value') // "2063c1608d6e0baf80249c42e2be5804"
```

Calculate the ([hex](https://en.wikipedia.org/wiki/Hexadecimal)-encoded)
[HMAC](https://en.wikipedia.org/wiki/HMAC)-MD5 hash of a given string value and
key:

```js
var hash = md5('value', 'key') // "01433efd5f16327ea4b31144572c67f6"
```

Calculate the raw [MD5](https://en.wikipedia.org/wiki/MD5) hash of a given
string value:

```js
var hash = md5('value', null, true)
```

Calculate the raw [HMAC](https://en.wikipedia.org/wiki/HMAC)-MD5 hash of a given
string value and key:

```js
var hash = md5('value', 'key', true)
```

## Tests

The JavaScript MD5 project comes with
[Unit Tests](https://en.wikipedia.org/wiki/Unit_testing).  
There are two different ways to run the tests:

- Open test/index.html in your browser or
- run `npm test` in the Terminal in the root path of the repository package.

The first one tests the browser integration, the second one the
[node.js](http://nodejs.org/) integration.

## License

The JavaScript MD5 script is released under the
[MIT license](https://opensource.org/licenses/MIT).
