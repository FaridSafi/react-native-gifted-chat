/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
"use strict";

const CRLF = "\r\n";
const BOUNDARY = "3beqjf3apnqeu3h5jqorms4i";

class MultipartResponse {
  static wrap(req, res) {
    if (acceptsMultipartResponse(req)) {
      return new MultipartResponse(res);
    } // Ugly hack, ideally wrap function should always return a proxy
    // object with the same interface

    res.writeChunk = () => {}; // noop

    return res;
  }

  constructor(res) {
    this.res = res;
    this.headers = {};
    res.writeHead(200, {
      "Content-Type": `multipart/mixed; boundary="${BOUNDARY}"`
    });
    res.write(
      "If you are seeing this, your client does not support multipart response"
    );
  }

  writeChunk(headers, data) {
    let isLast =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let chunk = `${CRLF}--${BOUNDARY}${CRLF}`;

    if (headers) {
      chunk += MultipartResponse.serializeHeaders(headers) + CRLF + CRLF;
    }

    if (data) {
      chunk += data;
    }

    if (isLast) {
      chunk += `${CRLF}--${BOUNDARY}--${CRLF}`;
    }

    if (!this.res.finished) {
      this.res.write(chunk);
    }
  }

  writeHead(status, headers) {
    // We can't actually change the response HTTP status code
    // because the headers have already been sent
    this.setHeader("X-Http-Status", status);

    if (!headers) {
      return;
    }

    for (const key in headers) {
      this.setHeader(key, headers[key]);
    }
  }

  setHeader(name, value) {
    this.headers[name] = value;
  }

  end(data) {
    this.writeChunk(this.headers, data, true);
    this.res.end();
  }

  static serializeHeaders(headers) {
    return Object.keys(headers)
      .map(key => `${key}: ${headers[key]}`)
      .join(CRLF);
  }
}

function acceptsMultipartResponse(req) {
  return req.headers && req.headers.accept === "multipart/mixed";
}

module.exports = MultipartResponse;
