'use strict';

/**
 * ICNS Header
 *
 * | Offset | Size | Purpose                                                |
 * | 0	    | 4    | Magic literal, must be "icns" (0x69, 0x63, 0x6e, 0x73) |
 * | 4      | 4    | Length of file, in bytes, msb first.                   |
 *
 **/
var SIZE_HEADER = 4 + 4; // 8
var FILE_LENGTH_OFFSET = 4; // MSB => BIG ENDIAN

/**
 * Image Entry
 *
 * | Offset | Size | Purpose                                                          |
 * | 0	    | 4    | Icon type, see OSType below.                                     |
 * | 4      | 4    | Length of data, in bytes (including type and length), msb first. |
 * | 8      | n    | Icon data                                                        |
 *
 **/
var ENTRY_LENGTH_OFFSET = 4; // MSB => BIG ENDIAN

function isICNS (buffer) {
  return ('icns' === buffer.toString('ascii', 0, 4));
}

var ICON_TYPE_SIZE = {
  ICON: 32,
  'ICN#': 32,
  // m => 16 x 16
  'icm#': 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  'ics#': 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024,
};

function readImageHeader(buffer, imageOffset) {
  var imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  // returns [type, length]
  return [
    buffer.toString('ascii', imageOffset, imageLengthOffset),
    buffer.readUInt32BE(imageLengthOffset)
  ];
}

function getImageSize(type) {
  var size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type: type };
}

function calculate (buffer) {
  var
    bufferLength = buffer.length,
    imageOffset = SIZE_HEADER,
    fileLength = buffer.readUInt32BE(FILE_LENGTH_OFFSET),
    imageHeader,
    imageSize,
    result;

  imageHeader = readImageHeader(buffer, imageOffset);
  imageSize = getImageSize(imageHeader[0]);
  imageOffset += imageHeader[1];

  if (imageOffset === fileLength) {
    return imageSize;
  }
  
  result = {
    width: imageSize.width,
    height: imageSize.height,
    images: [imageSize]
  };
  
  while (imageOffset < fileLength && imageOffset < bufferLength) {
    imageHeader = readImageHeader(buffer, imageOffset);
    imageSize = getImageSize(imageHeader[0]);
    imageOffset += imageHeader[1];
    result.images.push(imageSize);
  }
  
  return result;
}

module.exports = {
  'detect': isICNS,
  'calculate': calculate
};
