/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const GraphNotFoundError = require('./IncrementalBundler/GraphNotFoundError');
const IncrementalBundler = require('./IncrementalBundler');
const RevisionNotFoundError = require('./IncrementalBundler/RevisionNotFoundError');

const debounceAsyncQueue = require('./lib/debounceAsyncQueue');
const formatBundlingError = require('./lib/formatBundlingError');
const getGraphId = require('./lib/getGraphId');
const hmrJSBundle = require('./DeltaBundler/Serializers/hmrJSBundle');
const logToConsole = require('./lib/logToConsole');
const nullthrows = require('nullthrows');
const parseOptionsFromUrl = require('./lib/parseOptionsFromUrl');
const splitBundleOptions = require('./lib/splitBundleOptions');
const transformHelpers = require('./lib/transformHelpers');
const url = require('url');

const {
  Logger: {createActionStartEntry, createActionEndEntry, log},
} = require('metro-core');

import type {RevisionId} from './IncrementalBundler';
import type {
  HmrMessage,
  HmrClientMessage,
  HmrUpdateMessage,
  HmrErrorMessage,
} from './lib/bundle-modules/types.flow';
import type {ConfigT} from 'metro-config/src/configTypes.flow';

type $ReturnType<F> = $Call<<A, R>((...A) => R) => R, F>;
export type EntryPointURL = $ReturnType<typeof url.parse>;

type Client = {|
  optedIntoHMR: boolean,
  revisionIds: Array<RevisionId>,
  +sendFn: string => void,
|};

type ClientGroup = {|
  +clients: Set<Client>,
  clientUrl: EntryPointURL,
  revisionId: RevisionId,
  +unlisten: () => void,
|};

function send(sendFns: Array<(string) => void>, message: HmrMessage): void {
  const strMessage = JSON.stringify(message);
  sendFns.forEach((sendFn: string => void) => sendFn(strMessage));
}

/**
 * The HmrServer (Hot Module Reloading) implements a lightweight interface
 * to communicate easily to the logic in the React Native repository (which
 * is the one that handles the Web Socket connections).
 *
 * This interface allows the HmrServer to hook its own logic to WS clients
 * getting connected, disconnected or having errors (through the
 * `onClientConnect`, `onClientDisconnect` and `onClientError` methods).
 */
class HmrServer<TClient: Client> {
  _config: ConfigT;
  _bundler: IncrementalBundler;
  _createModuleId: (path: string) => number;
  _clientGroups: Map<RevisionId, ClientGroup>;

  constructor(
    bundler: IncrementalBundler,
    createModuleId: (path: string) => number,
    config: ConfigT,
  ) {
    this._config = config;
    this._bundler = bundler;
    this._createModuleId = createModuleId;
    this._clientGroups = new Map();
  }

  async onClientConnect(
    requestUrl: string,
    sendFn: (data: string) => void,
  ): Promise<Client> {
    return {
      sendFn,
      revisionIds: [],
      optedIntoHMR: false,
    };
  }

  async _registerEntryPoint(
    client: Client,
    requestUrl: string,
    sendFn: (data: string) => void,
  ): Promise<void> {
    const clientUrl = nullthrows(url.parse(requestUrl, true));
    const query = nullthrows(clientUrl.query);

    let revPromise;
    if (query.revisionId) {
      const revisionId = query.revisionId;
      revPromise = this._bundler.getRevision(revisionId);

      if (!revPromise) {
        send([sendFn], {
          type: 'error',
          body: formatBundlingError(new RevisionNotFoundError(revisionId)),
        });
        return;
      }
    } else if (query.bundleEntry != null) {
      const {options} = parseOptionsFromUrl(
        requestUrl,
        new Set(this._config.resolver.platforms),
      );
      const {entryFile, transformOptions, graphOptions} = splitBundleOptions(
        options,
      );

      /**
       * `entryFile` is relative to projectRoot, we need to use resolution function
       * to find the appropriate file with supported extensions.
       */
      const resolutionFn = await transformHelpers.getResolveDependencyFn(
        this._bundler.getBundler(),
        transformOptions.platform,
      );
      const resolvedEntryFilePath = resolutionFn(
        this._config.projectRoot + '/.',
        entryFile,
      );
      const graphId = getGraphId(resolvedEntryFilePath, transformOptions, {
        shallow: graphOptions.shallow,
        experimentalImportBundleSupport: this._config.transformer
          .experimentalImportBundleSupport,
      });
      revPromise = this._bundler.getRevisionByGraphId(graphId);

      if (!revPromise) {
        send([sendFn], {
          type: 'error',
          body: formatBundlingError(new GraphNotFoundError(graphId)),
        });
        return;
      }
    } else {
      return;
    }

    const {graph, id} = await revPromise;
    client.revisionIds.push(id);

    let clientGroup = this._clientGroups.get(id);
    if (clientGroup != null) {
      clientGroup.clients.add(client);
    } else {
      // Prepare the clientUrl to be used as sourceUrl in HMR updates.
      clientUrl.protocol = 'http';
      const {platform, dev, minify, runModule} = clientUrl.query || {};
      clientUrl.query = {
        platform,
        dev: dev || 'true',
        minify: minify || 'false',
        modulesOnly: 'true',
        runModule: runModule || 'false',
        shallow: 'true',
      };
      clientUrl.search = '';

      clientGroup = {
        clients: new Set([client]),
        clientUrl,
        revisionId: id,
        unlisten: (): void => unlisten(),
      };

      this._clientGroups.set(id, clientGroup);

      const unlisten = this._bundler.getDeltaBundler().listen(
        graph,
        debounceAsyncQueue(
          this._handleFileChange.bind(this, clientGroup, {
            isInitialUpdate: false,
          }),
          50,
        ),
      );
    }

    await this._handleFileChange(clientGroup, {isInitialUpdate: true});
    send([sendFn], {type: 'bundle-registered'});
  }

  async onClientMessage(
    client: TClient,
    message: string,
    sendFn: (data: string) => void,
  ): Promise<void> {
    let data: HmrClientMessage;
    try {
      data = JSON.parse(message);
    } catch (error) {
      send([sendFn], {
        type: 'error',
        body: formatBundlingError(error),
      });
      return Promise.resolve();
    }
    if (data && data.type) {
      switch (data.type) {
        case 'register-entrypoints':
          return Promise.all(
            data.entryPoints.map(entryPoint =>
              this._registerEntryPoint(client, entryPoint, sendFn),
            ),
          );
        case 'log':
          logToConsole(data.level, data.data);
          break;
        case 'log-opt-in':
          client.optedIntoHMR = true;
          break;
        default:
          break;
      }
    }
    return Promise.resolve();
  }

  onClientError(client: TClient, e: Error): void {
    this._config.reporter.update({
      type: 'hmr_client_error',
      error: e,
    });
    this.onClientDisconnect(client);
  }

  onClientDisconnect(client: TClient): void {
    client.revisionIds.forEach(revisionId => {
      const group = this._clientGroups.get(revisionId);
      if (group != null) {
        if (group.clients.size === 1) {
          this._clientGroups.delete(revisionId);
          group.unlisten();
        } else {
          group.clients.delete(client);
        }
      }
    });
  }

  async _handleFileChange(
    group: ClientGroup,
    options: {|isInitialUpdate: boolean|},
  ): Promise<void> {
    const optedIntoHMR = [...group.clients].some(
      (client: Client) => client.optedIntoHMR,
    );
    const processingHmrChange = log(
      createActionStartEntry({
        // Even when HMR is disabled on the client, this function still
        // runs so we can stash updates while it's off and apply them later.
        // However, this would mess up our internal analytics because we track
        // HMR as being used even for people who have it disabled.
        // As a workaround, we use a different event name for clients
        // that didn't explicitly opt into HMR.
        action_name: optedIntoHMR
          ? 'Processing HMR change'
          : 'Processing HMR change (no client opt-in)',
      }),
    );

    const sendFns = [...group.clients].map((client: Client) => client.sendFn);

    send(sendFns, {
      type: 'update-start',
      body: options,
    });
    const message = await this._prepareMessage(group, options);
    send(sendFns, message);
    send(sendFns, {type: 'update-done'});

    log({
      ...createActionEndEntry(processingHmrChange),
      outdated_modules:
        message.type === 'update'
          ? message.body.added.length + message.body.modified.length
          : undefined,
    });
  }

  async _prepareMessage(
    group: ClientGroup,
    options: {|isInitialUpdate: boolean|},
  ): Promise<HmrUpdateMessage | HmrErrorMessage> {
    try {
      const revPromise = this._bundler.getRevision(group.revisionId);
      if (!revPromise) {
        return {
          type: 'error',
          body: formatBundlingError(
            new RevisionNotFoundError(group.revisionId),
          ),
        };
      }

      const {revision, delta} = await this._bundler.updateGraph(
        await revPromise,
        false,
      );

      this._clientGroups.delete(group.revisionId);
      group.revisionId = revision.id;
      for (const client of group.clients) {
        client.revisionIds = client.revisionIds.filter(
          revisionId => revisionId !== group.revisionId,
        );
        client.revisionIds.push(revision.id);
      }
      this._clientGroups.set(group.revisionId, group);

      const hmrUpdate = hmrJSBundle(delta, revision.graph, {
        createModuleId: this._createModuleId,
        projectRoot: this._config.projectRoot,
        clientUrl: group.clientUrl,
      });

      return {
        type: 'update',
        body: {
          revisionId: revision.id,
          isInitialUpdate: options.isInitialUpdate,
          ...hmrUpdate,
        },
      };
    } catch (error) {
      const formattedError = formatBundlingError(error);

      this._config.reporter.update({type: 'bundling_error', error});

      return {type: 'error', body: formattedError};
    }
  }
}

module.exports = HmrServer;
