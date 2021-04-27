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

const MetroApi = require('../index');
const TerminalReporter = require('../lib/TerminalReporter');

const {makeAsyncCommand} = require('../cli-utils');
const {loadConfig} = require('metro-config');
const {Terminal} = require('metro-core');

import typeof Yargs from 'yargs';

const term = new Terminal(process.stdout);
const updateReporter = new TerminalReporter(term);

module.exports = () => ({
  command: 'build <entry>',

  description:
    'Generates a JavaScript bundle containing the specified entrypoint and its descendants',

  builder: (yargs: Yargs): void => {
    yargs.option('project-roots', {
      alias: 'P',
      type: 'string',
      array: true,
    });
    yargs.option('out', {alias: 'O', type: 'string', demandOption: true});

    yargs.option('platform', {alias: 'p', type: 'string'});
    yargs.option('output-type', {alias: 't', type: 'string'});

    yargs.option('max-workers', {alias: 'j', type: 'number'});

    yargs.option('minify', {alias: 'z', type: 'boolean'});
    yargs.option('dev', {alias: 'g', type: 'boolean'});

    yargs.option('source-map', {type: 'boolean'});
    yargs.option('source-map-url', {type: 'string'});

    yargs.option('legacy-bundler', {type: 'boolean'});

    yargs.option('config', {alias: 'c', type: 'string'});

    // Deprecated
    // $FlowFixMe Errors found when flow-typing `yargs`
    yargs.option('reset-cache', {type: 'boolean', describe: null});
  },

  // eslint-disable-next-line lint/no-unclear-flowtypes
  handler: makeAsyncCommand(async (argv: any) => {
    const config = await loadConfig(argv);

    await MetroApi.runBuild(config, {
      ...argv,
      onBegin: (): void => {
        updateReporter.update({
          buildID: '$',
          type: 'bundle_build_started',
          bundleDetails: {
            entryFile: argv.entry,
            platform: argv.platform,
            dev: !!argv.dev,
            minify: !!argv.optimize,
            bundleType: 'Bundle',
          },
        });
      },
      onProgress: (
        transformedFileCount: number,
        totalFileCount: number,
      ): void => {
        updateReporter.update({
          buildID: '$',
          type: 'bundle_transform_progressed_throttled',
          transformedFileCount,
          totalFileCount,
        });
      },
      onComplete: (): void => {
        updateReporter.update({
          buildID: '$',
          type: 'bundle_build_done',
        });
      },
    });
  }),
});
