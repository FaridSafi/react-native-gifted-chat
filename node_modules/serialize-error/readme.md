# serialize-error [![Build Status](https://travis-ci.org/sindresorhus/serialize-error.svg?branch=master)](https://travis-ci.org/sindresorhus/serialize-error)

> Serialize an error into a plain object

Useful if you for example need to `JSON.stringify()` or `process.send()` the error.


## Install

```
$ npm install --save serialize-error
```


## Usage

```js
const serializeError = require('serialize-error');
const error = new Error('unicorn');

console.log(error);
//=> [Error: unicorn]

console.log(serializeError(error));
//=> {name: 'Error', message: 'unicorn', stack: 'Error: unicorn\n    at Object.<anonymous> ...'}
```


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
