"use strict";

exports.__esModule = true;
exports.default = void 0;

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var dataUriPattern = /^data:/;

var ImageUriCache =
/*#__PURE__*/
function () {
  function ImageUriCache() {}

  ImageUriCache.has = function has(uri) {
    var entries = ImageUriCache._entries;
    var isDataUri = dataUriPattern.test(uri);
    return isDataUri || Boolean(entries[uri]);
  };

  ImageUriCache.add = function add(uri) {
    var entries = ImageUriCache._entries;
    var lastUsedTimestamp = Date.now();

    if (entries[uri]) {
      entries[uri].lastUsedTimestamp = lastUsedTimestamp;
      entries[uri].refCount += 1;
    } else {
      entries[uri] = {
        lastUsedTimestamp: lastUsedTimestamp,
        refCount: 1
      };
    }
  };

  ImageUriCache.remove = function remove(uri) {
    var entries = ImageUriCache._entries;

    if (entries[uri]) {
      entries[uri].refCount -= 1;
    } // Free up entries when the cache is "full"


    ImageUriCache._cleanUpIfNeeded();
  };

  ImageUriCache._cleanUpIfNeeded = function _cleanUpIfNeeded() {
    var entries = ImageUriCache._entries;
    var imageUris = Object.keys(entries);

    if (imageUris.length + 1 > ImageUriCache._maximumEntries) {
      var leastRecentlyUsedKey;
      var leastRecentlyUsedEntry;
      imageUris.forEach(function (uri) {
        var entry = entries[uri];

        if ((!leastRecentlyUsedEntry || entry.lastUsedTimestamp < leastRecentlyUsedEntry.lastUsedTimestamp) && entry.refCount === 0) {
          leastRecentlyUsedKey = uri;
          leastRecentlyUsedEntry = entry;
        }
      });

      if (leastRecentlyUsedKey) {
        delete entries[leastRecentlyUsedKey];
      }
    }
  };

  return ImageUriCache;
}();

exports.default = ImageUriCache;
ImageUriCache._maximumEntries = 256;
ImageUriCache._entries = {};
module.exports = exports.default;