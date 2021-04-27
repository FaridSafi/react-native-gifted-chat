"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// https://gist.github.com/pguillory/729616
function hookStdout(callback) {
  let old_write = process.stdout.write; // @ts-ignore

  process.stdout.write = (write => function (str) {
    write.apply(process.stdout, arguments);
    callback(str);
  })(process.stdout.write);

  return () => {
    process.stdout.write = old_write;
  };
}

var _default = hookStdout;
exports.default = _default;