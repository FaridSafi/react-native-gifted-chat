bplist-creator
==============

Binary Mac OS X Plist (property list) creator.

## Installation

```bash
$ npm install bplist-creator
```

## Quick Examples

```javascript
var bplist = require('bplist-creator');

var buffer = bplist({
  key1: [1, 2, 3]
});
```

## Real/Double/Float handling

Javascript don't have different types for `1` and `1.0`. This package
will automatically store numbers as the appropriate type, but can't
detect floats that is also integers.

If you need to force a value to be written with the `real` type pass
an instance of `Real`.

```javascript
var buffer = bplist({
  backgroundRed: new bplist.Real(1),
  backgroundGreen: new bplist.Real(0),
  backgroundBlue: new bplist.Real(0)
});
```

In `xml` the corresponding tags is `<integer>` and `<real>`.

## License

(The MIT License)

Copyright (c) 2012 Near Infinity Corporation

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
