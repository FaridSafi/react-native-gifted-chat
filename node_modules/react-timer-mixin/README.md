# react-timer-mixin

Using bare setTimeout, setInterval, setImmediate and requestAnimationFrame calls
is very dangerous because if you forget to cancel the request before the
component is unmounted, you risk the callback throwing an exception.

If you include TimerMixin, then you can replace your calls to
`setTimeout(fn, 500)` with `this.setTimeout(fn, 500)` (just prepend `this.`) and
everything will be properly cleaned up for you.

## Installation

Install the module directly from npm:

```
npm install react-timer-mixin
```

## Example

```js
var React = require('react');
var TimerMixin = require('react-timer-mixin');

var Component = React.createClass({
  mixins: [TimerMixin],
  componentDidMount() {
    this.setTimeout(
      () => { console.log('I do not leak!'); },
      500
    );
  }
});
```

