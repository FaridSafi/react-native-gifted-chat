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

var _Buffer2;

const crc32 = require("buffer-crc32");

const _require = require("stream"),
  Readable = _require.Readable;

exports.toJSON = JSON.stringify; // binary streaming format for delta bundles:
// FB DE 17 A5     magic number
// uint24 format version (1)
// bool base
// uint32 revisionIdLength: length of revisionId
// char[revisionIdLength] revisionId
// if (base)
//   uint32 preLength: length of "pre" section
//   char[preLength] pre section
//   char[4] pre section crc32
//   uint32 postLength: length of "post" section
//   char[postLength] post section
//   char[4] post section crc32
// module[], where module = {
//   uint32 id
//   uint32 length
//   char[length] code
//   char[4] code crc32
// }

exports.toBinaryStream = bundle => {
  const gen = streamBundle(bundle);
  return new Readable({
    read() {
      const _gen$next = gen.next(),
        _gen$next$value = _gen$next.value,
        value = _gen$next$value === void 0 ? null : _gen$next$value;

      this.push(value);
    }
  });
};

const MAGIC_NUMBER = Buffer.of(0xfb, 0xde, 0x17, 0xa5);
const FORMAT_VERSION = [0x01, 0x00, 0x00];

function* streamBundle(bundle) {
  var _Buffer;

  yield MAGIC_NUMBER;
  yield (_Buffer = Buffer).of.apply(
    _Buffer,
    FORMAT_VERSION.concat([bundle.base ? 1 : 0])
  );
  yield str(bundle.revisionId);

  if (bundle.base) {
    yield preOrPostSection(bundle.pre);
    yield preOrPostSection(bundle.post);

    for (const m of bundle.modules) {
      yield _module(m);
    }
  } else {
    for (const m of bundle.added) {
      yield _module(m);
    }

    for (const m of bundle.modified) {
      yield _module(m);
    }

    for (const id of bundle.deleted) {
      yield _module([id, null]);
    }
  }
}

const SIZEOF_UINT32 = 4;

function str(value) {
  const size = Buffer.byteLength(value);
  const buffer = Buffer.allocUnsafe(size + SIZEOF_UINT32);
  buffer.writeUInt32LE(size, 0);
  buffer.write(value, SIZEOF_UINT32, size, "utf8");
  return buffer;
}

const ABSENT_VALUE = 0xffffffff;
const ABSENT_BUFFER = [0xff, 0xff, 0xff, 0xff];
const EMPTY_CRC32 = [0x00, 0x00, 0x00, 0x00];

const EMPTY_PRE_OR_POST_SECTION = (_Buffer2 = Buffer).of.apply(
  _Buffer2,
  ABSENT_BUFFER.concat(EMPTY_CRC32)
);

function preOrPostSection(section) {
  if (section.length === 0) {
    return EMPTY_PRE_OR_POST_SECTION;
  }

  const size = Buffer.byteLength(section, "utf8");
  const buffer = Buffer.allocUnsafe(size + SIZEOF_UINT32 * 2); // space for size and checksum

  buffer.writeUInt32LE(size, 0);
  buffer.write(section, SIZEOF_UINT32, size, "utf8");
  appendCRC32(buffer);
  return buffer;
}

function _module(idAndCode) {
  const code = idAndCode[1];
  let buffer, length;

  if (code == null) {
    length = ABSENT_VALUE;
    buffer = Buffer.allocUnsafe(SIZEOF_UINT32 * 3); // id, length, crc32
  } else {
    length = Buffer.byteLength(code, "utf8");
    buffer = Buffer.allocUnsafe(length + SIZEOF_UINT32 * 3);
    buffer.write(code, SIZEOF_UINT32 * 2, length, "utf8");
  }

  buffer.writeUInt32LE(idAndCode[0], 0);
  buffer.writeUInt32LE(length, SIZEOF_UINT32);
  appendCRC32(buffer);
  return buffer;
}

function appendCRC32(buffer) {
  const CRC32_OFFSET = buffer.length - SIZEOF_UINT32;
  buffer.writeUInt32LE(
    crc32.unsigned(buffer.slice(0, CRC32_OFFSET)),
    CRC32_OFFSET
  );
}
