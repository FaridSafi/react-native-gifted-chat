/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

const readline = require("readline");

const throttle = require("lodash.throttle");

const tty = require("tty");

const util = require("util");

/**
 * Clear some text that was previously printed on an interactive stream,
 * without trailing newline character (so we have to move back to the
 * beginning of the line).
 */
function clearStringBackwards(stream, str) {
  readline.moveCursor(stream, -stream.columns, 0);
  readline.clearLine(stream, 0);
  let lineCount = (str.match(/\n/g) || []).length;

  while (lineCount > 0) {
    readline.moveCursor(stream, 0, -1);
    readline.clearLine(stream, 0);
    --lineCount;
  }
}
/**
 * Cut a string into an array of string of the specific maximum size. A newline
 * ends a chunk immediately (it's not included in the "." RexExp operator), and
 * is not included in the result.
 * When counting we should ignore non-printable characters. In particular the
 * ANSI escape sequences (regex: /\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?m/)
 * (Not an exhaustive match, intended to match ANSI color escapes)
 * https://en.wikipedia.org/wiki/ANSI_escape_code
 */

function chunkString(str, size) {
  const ANSI_COLOR = "\x1B\\[([0-9]{1,2}(;[0-9]{1,2})?)?m";
  const SKIP_ANSI = `(?:${ANSI_COLOR})*`;
  return str.match(new RegExp(`(?:${SKIP_ANSI}.){1,${size}}`, "g")) || [];
}
/**
 * Get the stream as a TTY if it effectively looks like a valid TTY.
 */

function getTTYStream(stream) {
  if (
    stream instanceof tty.WriteStream &&
    stream.isTTY &&
    stream.columns >= 1
  ) {
    return stream;
  }

  return null;
}
/**
 * We don't just print things to the console, sometimes we also want to show
 * and update progress. This utility just ensures the output stays neat: no
 * missing newlines, no mangled log lines.
 *
 *     const terminal = Terminal.default;
 *     terminal.status('Updating... 38%');
 *     terminal.log('warning: Something happened.');
 *     terminal.status('Updating, done.');
 *     terminal.persistStatus();
 *
 * The final output:
 *
 *     warning: Something happened.
 *     Updating, done.
 *
 * Without the status feature, we may get a mangled output:
 *
 *     Updating... 38%warning: Something happened.
 *     Updating, done.
 *
 * This is meant to be user-readable and TTY-oriented. We use stdout by default
 * because it's more about status information than diagnostics/errors (stderr).
 *
 * Do not add any higher-level functionality in this class such as "warning" and
 * "error" printers, as it is not meant for formatting/reporting. It has the
 * single responsibility of handling status messages.
 */

class Terminal {
  constructor(stream) {
    this._logLines = [];
    this._nextStatusStr = "";
    this._scheduleUpdate = throttle(this._update, 33);
    this._statusStr = "";
    this._stream = stream;
  }
  /**
   * Clear and write the new status, logging in bulk in-between. Doing this in a
   * throttled way (in a different tick than the calls to `log()` and
   * `status()`) prevents us from repeatedly rewriting the status in case
   * `terminal.log()` is called several times.
   */

  _update() {
    const _statusStr = this._statusStr,
      _stream = this._stream;
    const ttyStream = getTTYStream(_stream);

    if (_statusStr === this._nextStatusStr && this._logLines.length === 0) {
      return;
    }

    if (ttyStream != null) {
      clearStringBackwards(ttyStream, _statusStr);
    }

    this._logLines.forEach(line => {
      _stream.write(line);

      _stream.write("\n");
    });

    this._logLines = [];

    if (ttyStream != null) {
      this._nextStatusStr = chunkString(
        this._nextStatusStr,
        ttyStream.columns
      ).join("\n");

      _stream.write(this._nextStatusStr);
    }

    this._statusStr = this._nextStatusStr;
  }
  /**
   * Shows some text that is meant to be overriden later. Return the previous
   * status that was shown and is no more. Calling `status()` with no argument
   * removes the status altogether. The status is never shown in a
   * non-interactive terminal: for example, if the output is redirected to a
   * file, then we don't care too much about having a progress bar.
   */

  status(format) {
    const _nextStatusStr = this._nextStatusStr;

    for (
      var _len = arguments.length,
        args = new Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      args[_key - 1] = arguments[_key];
    }

    this._nextStatusStr = util.format.apply(util, [format].concat(args));

    this._scheduleUpdate();

    return _nextStatusStr;
  }
  /**
   * Similar to `console.log`, except it moves the status/progress text out of
   * the way correctly. In non-interactive terminals this is the same as
   * `console.log`.
   */

  log(format) {
    for (
      var _len2 = arguments.length,
        args = new Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2 - 1] = arguments[_key2];
    }

    this._logLines.push(util.format.apply(util, [format].concat(args)));

    this._scheduleUpdate();
  }
  /**
   * Log the current status and start from scratch. This is useful if the last
   * status was the last one of a series of updates.
   */

  persistStatus() {
    this.log(this._nextStatusStr);
    this._nextStatusStr = "";
  }

  flush() {
    // Useful if you're going to start calling console.log/console.error directly
    // again; otherwise you could end up with mangled output when the queued
    // update starts writing to stream after a delay.

    /* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an
     * error found when Flow v0.99 was deployed. To see the error, delete this
     * comment and run Flow. */
    this._scheduleUpdate.flush();
  }
}

module.exports = Terminal;
