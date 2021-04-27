'use strict';

// load all available handlers for browserify support
var typeHandlers = {
  bmp: require('./types/bmp'),
  cur: require('./types/cur'),
  dds: require('./types/dds'),
  gif: require('./types/gif'),
  icns: require('./types/icns'),
  ico: require('./types/ico'),
  jpg: require('./types/jpg'),
  png: require('./types/png'),
  psd: require('./types/psd'),
  svg: require('./types/svg'),
  tiff: require('./types/tiff'),
  webp: require('./types/webp'),
};

module.exports = typeHandlers;
