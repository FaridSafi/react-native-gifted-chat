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

const {watchFile, makeAsyncCommand} = require('../cli-utils');
const {loadConfig, resolveConfig} = require('metro-config');
const {promisify} = require('util');

import typeof Yargs from 'yargs';

module.exports = () => ({
  command: 'serve',

  description:
    'Starts a Metro server on the given port, building bundles on the fly',

  builder: (yargs: Yargs): void => {
    yargs.option('project-roots', {
      alias: 'P',
      type: 'string',
      array: true,
    });

    yargs.option('host', {alias: 'h', type: 'string', default: 'localhost'});
    yargs.option('port', {alias: 'p', type: 'number', default: 8080});

    yargs.option('max-workers', {alias: 'j', type: 'number'});

    yargs.option('secure', {type: 'boolean'});
    yargs.option('secure-key', {type: 'string'});
    yargs.option('secure-cert', {type: 'string'});

    yargs.option('hmr-enabled', {alias: 'hmr', type: 'boolean'});

    yargs.option('config', {alias: 'c', type: 'string'});

    // Deprecated
    // $FlowFixMe Errors found when flow-typing `yargs`
    yargs.option('reset-cache', {type: 'boolean', describe: null});
  },

  // eslint-disable-next-line lint/no-unclear-flowtypes
  handler: makeAsyncCommand(async (argv: any) => {
    let server = null;
    let restarting = false;

    async function restart(): Promise<void> {
      if (restarting) {
        return;
      } else {
        restarting = true;
      }

      if (server) {
        // eslint-disable-next-line no-console
        console.log('Configuration changed. Restarting the server...');
        await promisify(server.close).call(server);
      }

      const config = await loadConfig(argv);

      server = await MetroApi.runServer(config, argv);

      restarting = false;
    }

    const foundConfig = await resolveConfig(argv.config, argv.cwd);

    if (foundConfig) {
      await watchFile(foundConfig.filepath, restart);
    } else {
      await restart();
    }
  }),
});
