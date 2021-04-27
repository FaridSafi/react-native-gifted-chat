/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const type = 'TypeScript' as string
export const test = true as boolean

// Exporting default interface was broken before Babel 7.0.0-beta.56
export default interface A {}

export class B {
  constructor(public name: string){}
}
