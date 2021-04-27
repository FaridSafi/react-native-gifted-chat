# deep-assign [![Build Status](https://travis-ci.org/sindresorhus/deep-assign.svg?branch=master)](https://travis-ci.org/sindresorhus/deep-assign)

> Recursive [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)


## Install

```
$ npm install --save deep-assign
```


## Usage

```js
var deepAssign = require('deep-assign');

deepAssign({a: {b: 0}}, {a: {b: 1, c: 2}}, {a: {c: 3}});
//=> {a: {b: 1, c: 3}}
```


### deepAssign(target, source, [source, ...])

Recursively assigns own enumerable properties of `source` objects to the `target` object and returns the `target` object. Additional `source` objects will overwrite previous ones.


## Related

- [object-assign](https://github.com/sindresorhus/object-assign) - ES2015 Object.assign() ponyfill


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
