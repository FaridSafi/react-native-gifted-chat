/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

/* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.99 was deployed. To see the error, delete this comment
 * and run Flow. */
const template = require('@babel/template').default;
const babelTypes = require('@babel/types');
const babylon = require('@babel/parser');

import type {AssetDataFiltered, AssetDataWithoutFiles} from '../Assets';
import type {ModuleTransportLike} from '../shared/types.flow';
import type {Ast} from '@babel/core';

// Structure of the object: dir.name.scale = asset
export type RemoteFileMap = {
  [string]: {
    [string]: {
      [number]: {
        handle: string,
        hash: string,
      },
    },
  },
  __proto__: null,
};

// Structure of the object: platform.dir.name.scale = asset
export type PlatformRemoteFileMap = {
  [string]: RemoteFileMap,
  __proto__: null,
};

type SubTree<T: ModuleTransportLike> = (
  moduleTransport: T,
  moduleTransportsByPath: Map<string, T>,
) => Iterable<number>;

const assetPropertyBlacklist = new Set(['files', 'fileSystemLocation', 'path']);

function generateAssetCodeFileAst(
  assetRegistryPath: string,
  assetDescriptor: AssetDataWithoutFiles,
): Ast {
  const properDescriptor = filterObject(
    assetDescriptor,
    assetPropertyBlacklist,
  );

  // {...}
  const descriptorAst = babylon.parseExpression(
    JSON.stringify(properDescriptor),
  );
  const t = babelTypes;

  // require('AssetRegistry').registerAsset({...})
  const buildRequire = template(`
    module.exports = require(ASSET_REGISTRY_PATH).registerAsset(DESCRIPTOR_AST)
  `);

  return t.file(
    t.program([
      buildRequire({
        ASSET_REGISTRY_PATH: t.stringLiteral(assetRegistryPath),
        DESCRIPTOR_AST: descriptorAst,
      }),
    ]),
  );
}

/**
 * Generates the code involved in requiring an asset, but to be loaded remotely.
 * If the asset cannot be found within the map, then it falls back to the
 * standard asset.
 */
function generateRemoteAssetCodeFileAst(
  assetSourceResolverPath: string,
  assetDescriptor: AssetDataWithoutFiles,
  remoteServer: string,
  remoteFileMap: RemoteFileMap,
): ?Ast {
  const t = babelTypes;

  const file = remoteFileMap[assetDescriptor.fileSystemLocation];
  const descriptor = file && file[assetDescriptor.name];
  const data = {};

  if (!descriptor) {
    return null;
  }

  for (const scale in descriptor) {
    data[+scale] = descriptor[+scale].handle;
  }

  // {2: 'path/to/image@2x', 3: 'path/to/image@3x', ...}
  const astData = babylon.parseExpression(JSON.stringify(data));

  // URI to remote server
  const URI = t.stringLiteral(remoteServer);

  // Size numbers.
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
            .sort((a: number, b: number) => a - b)
            .map((scale: number) => t.numericLiteral(scale)),
        ),
      }),
    ]),
  );
}

// Test extension against all types supported by image-size module.
// If it's not one of these, we won't treat it as an image.
function isAssetTypeAnImage(type: string): boolean {
  return (
    ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(
      type,
    ) !== -1
  );
}

function filterObject(
  object: AssetDataWithoutFiles,
  blacklist: Set<string>,
): AssetDataFiltered {
  const copied = Object.assign({}, object);
  for (const key of blacklist) {
    delete copied[key];
  }
  return copied;
}

function createRamBundleGroups<T: ModuleTransportLike>(
  ramGroups: $ReadOnlyArray<string>,
  groupableModules: $ReadOnlyArray<T>,
  subtree: SubTree<T>,
): Map<number, Set<number>> {
  // build two maps that allow to lookup module data
  // by path or (numeric) module id;
  const byPath: Map<string, T> = new Map();
  const byId: Map<number, string> = new Map();
  groupableModules.forEach((m: T) => {
    byPath.set(m.sourcePath, m);
    byId.set(m.id, m.sourcePath);
  });

  // build a map of group root IDs to an array of module IDs in the group
  const result: Map<number, Set<number>> = new Map(
    ramGroups.map((modulePath: string) => {
      const root = byPath.get(modulePath);
      if (root == null) {
        throw Error(`Group root ${modulePath} is not part of the bundle`);
      }
      return [
        root.id,
        // `subtree` yields the IDs of all transitive dependencies of a module
        new Set(subtree(root, byPath)),
      ];
    }),
  );

  if (ramGroups.length > 1) {
    // build a map of all grouped module IDs to an array of group root IDs
    const all = new ArrayMap();
    for (const [parent, children] of result) {
      for (const module of children) {
        all.get(module).push(parent);
      }
    }

    // find all module IDs that are part of more than one group
    const doubles = filter(all, ([, parents]) => parents.length > 1);
    for (const [moduleId, parents] of doubles) {
      const parentNames = parents.map(byId.get, byId);
      const lastName = parentNames.pop();
      throw new Error(
        `Module ${byId.get(moduleId) ||
          moduleId} belongs to groups ${parentNames.join(', ')}, and ${String(
          lastName,
        )}. Ensure that each module is only part of one group.`,
      );
    }
  }

  return result;
}

function* filter<A: number, B: number>(
  iterator: ArrayMap<A, B>,
  predicate: ([A, Array<B>]) => boolean,
): Generator<[A, Array<B>], void, void> {
  for (const value of iterator) {
    if (predicate(value)) {
      yield value;
    }
  }
}

class ArrayMap<K, V> extends Map<K, Array<V>> {
  get(key: K): Array<V> {
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
  isAssetTypeAnImage,
};
