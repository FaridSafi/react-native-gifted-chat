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
/* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.99 was deployed. To see the error, delete this comment
 * and run Flow. */

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

const template = require("@babel/template").default;

const babelTypes = require("@babel/types");

const babylon = require("@babel/parser");

const assetPropertyBlacklist = new Set(["files", "fileSystemLocation", "path"]);

function generateAssetCodeFileAst(assetRegistryPath, assetDescriptor) {
  const properDescriptor = filterObject(
    assetDescriptor,
    assetPropertyBlacklist
  ); // {...}

  const descriptorAst = babylon.parseExpression(
    JSON.stringify(properDescriptor)
  );
  const t = babelTypes; // require('AssetRegistry').registerAsset({...})

  const buildRequire = template(`
    module.exports = require(ASSET_REGISTRY_PATH).registerAsset(DESCRIPTOR_AST)
  `);
  return t.file(
    t.program([
      buildRequire({
        ASSET_REGISTRY_PATH: t.stringLiteral(assetRegistryPath),
        DESCRIPTOR_AST: descriptorAst
      })
    ])
  );
}
/**
 * Generates the code involved in requiring an asset, but to be loaded remotely.
 * If the asset cannot be found within the map, then it falls back to the
 * standard asset.
 */

function generateRemoteAssetCodeFileAst(
  assetSourceResolverPath,
  assetDescriptor,
  remoteServer,
  remoteFileMap
) {
  const t = babelTypes;
  const file = remoteFileMap[assetDescriptor.fileSystemLocation];
  const descriptor = file && file[assetDescriptor.name];
  const data = {};

  if (!descriptor) {
    return null;
  }

  for (const scale in descriptor) {
    data[+scale] = descriptor[+scale].handle;
  } // {2: 'path/to/image@2x', 3: 'path/to/image@3x', ...}

  const astData = babylon.parseExpression(JSON.stringify(data)); // URI to remote server

  const URI = t.stringLiteral(remoteServer); // Size numbers.

  const WIDTH = t.numericLiteral(assetDescriptor.width);
  const HEIGHT = t.numericLiteral(assetDescriptor.height);
  const buildRequire = template(`
    module.exports = {
      "width": WIDTH,
      "height": HEIGHT,
      "uri": URI + OBJECT_AST[require(ASSET_SOURCE_RESOLVER_PATH).pickScale(SCALE_ARRAY)]
    };
  `);
  return t.file(
    t.program([
      buildRequire({
        WIDTH,
        HEIGHT,
        URI,
        OBJECT_AST: astData,
        ASSET_SOURCE_RESOLVER_PATH: t.stringLiteral(assetSourceResolverPath),
        SCALE_ARRAY: t.arrayExpression(
          Object.keys(descriptor)
            .map(Number)
            .sort((a, b) => a - b)
            .map(scale => t.numericLiteral(scale))
        )
      })
    ])
  );
} // Test extension against all types supported by image-size module.
// If it's not one of these, we won't treat it as an image.

function isAssetTypeAnImage(type) {
  return (
    ["png", "jpg", "jpeg", "bmp", "gif", "webp", "psd", "svg", "tiff"].indexOf(
      type
    ) !== -1
  );
}

function filterObject(object, blacklist) {
  const copied = Object.assign({}, object);

  for (const key of blacklist) {
    delete copied[key];
  }

  return copied;
}

function createRamBundleGroups(ramGroups, groupableModules, subtree) {
  // build two maps that allow to lookup module data
  const byPath = new Map();
  const byId = new Map();
  groupableModules.forEach(m => {
    byPath.set(m.sourcePath, m);
    byId.set(m.id, m.sourcePath);
  }); // build a map of group root IDs to an array of module IDs in the group

  const result = new Map(
    ramGroups.map(modulePath => {
      const root = byPath.get(modulePath);

      if (root == null) {
        throw Error(`Group root ${modulePath} is not part of the bundle`);
      }

      return [
        root.id, // `subtree` yields the IDs of all transitive dependencies of a module
        new Set(subtree(root, byPath))
      ];
    })
  );

  if (ramGroups.length > 1) {
    // build a map of all grouped module IDs to an array of group root IDs
    const all = new ArrayMap();

    for (const _ref of result) {
      var _ref2 = _slicedToArray(_ref, 2);

      const parent = _ref2[0];
      const children = _ref2[1];

      for (const module of children) {
        all.get(module).push(parent);
      }
    } // find all module IDs that are part of more than one group

    const doubles = filter(all, _ref3 => {
      let _ref4 = _slicedToArray(_ref3, 2),
        parents = _ref4[1];

      return parents.length > 1;
    });

    for (const _ref5 of doubles) {
      var _ref6 = _slicedToArray(_ref5, 2);

      const moduleId = _ref6[0];
      const parents = _ref6[1];
      const parentNames = parents.map(byId.get, byId);
      const lastName = parentNames.pop();
      throw new Error(
        `Module ${byId.get(moduleId) ||
          moduleId} belongs to groups ${parentNames.join(", ")}, and ${String(
          lastName
        )}. Ensure that each module is only part of one group.`
      );
    }
  }

  return result;
}

function* filter(iterator, predicate) {
  for (const value of iterator) {
    if (predicate(value)) {
      yield value;
    }
  }
}

class ArrayMap extends Map {
  get(key) {
    let array = super.get(key);

    if (!array) {
      array = [];
      this.set(key, array);
    }

    return array;
  }
}

module.exports = {
  createRamBundleGroups,
  generateAssetCodeFileAst,
  generateRemoteAssetCodeFileAst,
  isAssetTypeAnImage
};
