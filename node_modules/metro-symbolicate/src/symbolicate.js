#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Symbolicates a JavaScript stack trace using a source map.
 * In our first form, we read a stack trace from stdin and symbolicate it via
 * the provided source map.
 * In our second form, we symbolicate using an explicit line number, and
 * optionally a column.
 * In our third form, we symbolicate using a module ID, a line number, and
 * optionally a column.
 *
 * See https://our.intern.facebook.com/intern/dex/symbolicating-javascript-stack-traces-for-react-native/
 *
 *  strict-local
 * @format
 */
"use strict"; // flowlint-next-line untyped-import:off

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

const SourceMapConsumer = require("source-map").SourceMapConsumer;

const Symbolication = require("./Symbolication.js");

const fs = require("fs"); // flowlint-next-line untyped-import:off

const through2 = require("through2");

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator(function*() {
    let argvInput =
      arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : process.argv.slice(2);

    let _ref =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : process,
      stdin = _ref.stdin,
      stderr = _ref.stderr,
      stdout = _ref.stdout;

    const argv = argvInput.slice();

    function checkAndRemoveArg(arg) {
      let valuesPerArg =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      let values = null;

      for (let idx = argv.indexOf(arg); idx !== -1; idx = argv.indexOf(arg)) {
        argv.splice(idx, 1);
        values = values || [];
        values.push(argv.splice(idx, valuesPerArg));
      }

      return values;
    }

    function checkAndRemoveArgWithValue(arg) {
      const values = checkAndRemoveArg(arg, 1);
      return values ? values[0][0] : null;
    }

    try {
      const noFunctionNames = checkAndRemoveArg("--no-function-names");
      const inputLineStart = Number.parseInt(
        checkAndRemoveArgWithValue("--input-line-start") || "1",
        10
      );
      const inputColumnStart = Number.parseInt(
        checkAndRemoveArgWithValue("--input-column-start") || "0",
        10
      );
      const outputLineStart = Number.parseInt(
        checkAndRemoveArgWithValue("--output-line-start") || "1",
        10
      );
      const outputColumnStart = Number.parseInt(
        checkAndRemoveArgWithValue("--output-column-start") || "0",
        10
      );

      if (argv.length < 1 || argv.length > 4) {
        /* eslint no-path-concat: "off" */
        const usages = [
          "Usage: " + __filename + " <source-map-file>",
          "       " + __filename + " <source-map-file> <line> [column]",
          "       " +
            __filename +
            " <source-map-file> <moduleId>.js <line> [column]",
          "       " + __filename + " <source-map-file> <mapfile>.profmap",
          "       " +
            __filename +
            " <source-map-file> --attribution < in.jsonl > out.jsonl",
          "       " + __filename + " <source-map-file> <tracefile>.cpuprofile",
          " Optional flags:",
          "  --no-function-names",
          "  --input-line-start <line> (default: 1)",
          "  --input-column-start <column> (default: 0)",
          "  --output-line-start <line> (default: 1)",
          "  --output-column-start <column> (default: 0)"
        ];
        console.error(usages.join("\n"));
        return 1;
      } // Read the source map.

      const sourceMapFileName = argv.shift();
      const options = {
        nameSource: noFunctionNames ? "identifier_names" : "function_names",
        inputLineStart,
        inputColumnStart,
        outputLineStart,
        outputColumnStart
      };
      let context;

      if (fs.lstatSync(sourceMapFileName).isDirectory()) {
        context = Symbolication.unstable_createDirectoryContext(
          SourceMapConsumer,
          sourceMapFileName,
          options
        );
      } else {
        const content = fs.readFileSync(sourceMapFileName, "utf8");
        context = Symbolication.createContext(
          SourceMapConsumer,
          content,
          options
        );
      }

      if (argv.length === 0) {
        const stackTrace = yield readAll(stdin);
        stdout.write(context.symbolicate(stackTrace));
      } else if (argv[0].endsWith(".profmap")) {
        stdout.write(context.symbolicateProfilerMap(argv[0]));
      } else if (argv[0] === "--attribution") {
        let buffer = "";
        yield waitForStream(
          stdin
            .pipe(
              through2(function(data, enc, callback) {
                // Take arbitrary strings, output single lines
                buffer += data;
                const lines = buffer.split("\n");

                for (let i = 0, e = lines.length - 1; i < e; i++) {
                  this.push(lines[i]);
                }

                buffer = lines[lines.length - 1];
                callback();
              })
            )
            .pipe(
              through2.obj(function(data, enc, callback) {
                // This is JSONL, so each line is a separate JSON object
                const obj = JSON.parse(data);
                context.symbolicateAttribution(obj);
                this.push(JSON.stringify(obj) + "\n");
                callback();
              })
            )
            .pipe(stdout)
        );
      } else if (argv[0].endsWith(".cpuprofile")) {
        // NOTE: synchronous
        context.symbolicateChromeTrace(argv[0], {
          stdout,
          stderr
        });
      } else {
        var _original$source, _original$line, _original$name;

        // read-from-argv form.
        let moduleIds;

        if (argv[0].endsWith(".js")) {
          moduleIds = context.parseFileName(argv[0]);
          argv.shift();
        } else {
          moduleIds = null;
        }

        const lineNumber = argv.shift();
        const columnNumber = argv.shift() || 0;
        const original = context.getOriginalPositionFor(
          +lineNumber,
          +columnNumber, // $FlowFixMe context is a union here and so this parameter is a union
          moduleIds
        );
        stdout.write(
          [
            (_original$source = original.source) !== null &&
            _original$source !== void 0
              ? _original$source
              : "null",
            (_original$line = original.line) !== null &&
            _original$line !== void 0
              ? _original$line
              : "null",
            (_original$name = original.name) !== null &&
            _original$name !== void 0
              ? _original$name
              : "null"
          ].join(":") + "\n"
        );
      }
    } catch (error) {
      stderr.write(error + "\n");
      return 1;
    }

    return 0;
  });
  return _main.apply(this, arguments);
}

function readAll(stream) {
  return new Promise(resolve => {
    let data = "";

    if (stream.isTTY === true) {
      resolve(data);
      return;
    }

    stream.setEncoding("utf8");
    stream.on("readable", () => {
      let chunk; // flowlint-next-line sketchy-null-string:off

      while ((chunk = stream.read())) {
        data += chunk.toString();
      }
    });
    stream.on("end", () => {
      resolve(data);
    });
  });
}

function waitForStream(stream) {
  return new Promise(resolve => {
    stream.on("finish", resolve);
  });
}

if (require.main === module) {
  main().then(code => process.exit(code));
}

module.exports = main;
