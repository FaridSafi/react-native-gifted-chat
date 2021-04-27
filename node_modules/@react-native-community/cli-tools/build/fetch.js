"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;

function _nodeFetch() {
  const data = _interopRequireDefault(require("node-fetch"));

  _nodeFetch = function () {
    return data;
  };

  return data;
}

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function unwrapFetchResult(response) {
  const data = await response.text();

  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

async function fetch(url, options) {
  const result = await (0, _nodeFetch().default)(url, options);
  const data = await unwrapFetchResult(result);

  if (result.status >= 400) {
    throw new _errors.CLIError(`Fetch request failed with status ${result.status}: ${data}.`);
  }

  return {
    status: result.status,
    headers: result.headers,
    data
  };
}