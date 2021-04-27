# fbjs-scripts

This is a collection of tools and scripts intended to be used in conjunction with `fbjs`. Previously these were shipped as a part of `fbjs`.

```js
// before (fbjs@0.1.0)
var invariant = require('fbjs/lib/invariant');
var devExpression = require('fbjs/scripts/babel/dev-expression');

// after (fbjs, fbjs-scripts@0.2.0)
var invariant = require('fbjs/lib/invariant');
var devExpression = require('fbjs-scripts/babel/dev-expression');
```

## Why?

This ensures that production code consuming `fbjs` library code does not need to install script dependencies, unless you explicitly use them via the `fbjs-scripts` package.
