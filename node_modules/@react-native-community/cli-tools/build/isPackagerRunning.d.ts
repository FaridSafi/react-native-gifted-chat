/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Indicates whether or not the packager is running. It returns a promise that
 * returns one of these possible values:
 *   - `running`: the packager is running
 *   - `not_running`: the packager nor any process is running on the expected port.
 *   - `unrecognized`: one other process is running on the port we expect the packager to be running.
 */
declare function isPackagerRunning(packagerPort?: string | number): Promise<'running' | 'not_running' | 'unrecognized'>;
export default isPackagerRunning;
//# sourceMappingURL=isPackagerRunning.d.ts.map