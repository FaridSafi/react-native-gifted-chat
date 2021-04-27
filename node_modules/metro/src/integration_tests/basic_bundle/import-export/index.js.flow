/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict
 */

'use strict';

import {default as myDefault, foo as myFoo, myFunction} from './export-1';
import * as importStar from './export-2';
import {foo} from './export-null';
import primitiveDefault, {
  foo as primitiveFoo,
} from './export-primitive-default';

export {default as namedDefaultExported} from './export-3';
export {foo as default} from './export-4';

export const extraData = {
  foo,
  importStar,
  myDefault,
  myFoo,
  myFunction: myFunction(),
  primitiveDefault,
  primitiveFoo,
};

export const asyncImportCJS = import('./export-5');
export const asyncImportESM = import('./export-6');
