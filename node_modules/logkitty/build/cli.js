"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

var _api = require("./api");

var _formatters = require("./formatters");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const androidPriorityOptions = {
  unknown: {
    alias: ['U', 'u'],
    boolean: true,
    default: false,
    describe: 'Unknown priority'
  },
  verbose: {
    alias: ['V', 'v'],
    boolean: true,
    default: false,
    describe: 'Verbose priority'
  },
  debug: {
    alias: ['D', 'd'],
    boolean: true,
    default: false,
    describe: 'Debug priority'
  },
  info: {
    alias: ['I', 'i'],
    boolean: true,
    default: false,
    describe: 'Info priority'
  },
  warn: {
    alias: ['W', 'w'],
    boolean: true,
    default: false,
    describe: 'Warn priority'
  },
  error: {
    alias: ['E', 'e'],
    boolean: true,
    default: false,
    describe: 'Error priority'
  },
  fatal: {
    alias: ['F', 'f'],
    boolean: true,
    default: false,
    describe: 'Fatal priority'
  },
  silent: {
    alias: ['S', 's'],
    boolean: true,
    default: false,
    describe: 'Silent priority'
  }
};
const iosPriorityOptions = {
  debug: {
    alias: ['D', 'd'],
    boolean: true,
    default: false,
    describe: 'Debug level'
  },
  info: {
    alias: ['I', 'i'],
    boolean: true,
    default: false,
    describe: 'Info level'
  },
  error: {
    alias: ['E', 'e'],
    boolean: true,
    default: false,
    describe: 'Error level'
  }
};

const {
  argv: {
    _: [platform, filter],
    ...args
  }
} = _yargs.default.usage('Usage: $0 [options] <platform>').command('android', 'Android', yargs => yargs.command('tag <tags ...>', 'Show logs matching given tags', androidPriorityOptions).command('app <appId>', 'Show logs from application with given identifier', androidPriorityOptions).command('match <regexes...>', 'Show logs matching given patterns', androidPriorityOptions).command('custom <patterns ...>', 'Filter using custom patterns <tag>:<priority>').command('all', 'Show all logs', androidPriorityOptions).demandCommand(1).option('adb-path', {
  type: 'string',
  describe: 'Use custom path to adb',
  nargs: 1
}).example('$0 android tag MyTag', 'Filter logs to only include ones with MyTag tag').example('$0 android tag MyTag -I', 'Filter logs to only include ones with MyTag tag and priority INFO and above').example('$0 android app com.example.myApp', 'Show all logs from com.example.myApp').example('$0 android match device', 'Show all logs matching /device/gm regex').example('$0 android app com.example.myApp -E', 'Show all logs from com.example.myApp with priority ERROR and above').example('$0 android custom *:S MyTag:D', 'Silence all logs and show only ones with MyTag with priority DEBUG and above')).command('ios <filter>', 'iOS', yargs => yargs.command('tag <tags ...>', 'Show logs matching given tags', iosPriorityOptions).command('match <regexes...>', 'Show logs matching given patterns', iosPriorityOptions).command('all', 'Show all logs', iosPriorityOptions).demandCommand(1).example('$0 ios tag MyTag', 'Filter logs to only include ones with MyTag tag').example('$0 ios tag MyTag -i', 'Filter logs to only include ones with MyTag tag and priority Info and Error').example('$0 ios match device', 'Show all logs matching /device/gm regex')).demandCommand(1).help('h').alias('h', 'help').alias('v', 'version').version();

const selectedAndroidPriorities = {
  unknown: Boolean(args.unknown),
  verbose: Boolean(args.verbose),
  debug: Boolean(args.debug),
  info: Boolean(args.info),
  warn: Boolean(args.warn),
  error: Boolean(args.error),
  fatal: Boolean(args.fatal),
  silent: Boolean(args.silent)
};
const selectedIosPriorities = {
  debug: Boolean(args.debug),
  info: Boolean(args.info),
  error: Boolean(args.error)
};

try {
  let createFilter;

  switch (filter) {
    case 'app':
      createFilter = (0, _api.makeAppFilter)(args.appId);
      break;

    case 'tag':
      createFilter = (0, _api.makeTagsFilter)(...args.tags);
      break;

    case 'match':
      createFilter = (0, _api.makeMatchFilter)(...args.regexes.map(value => new RegExp(value, 'gm')));
      break;

    case 'custom':
      createFilter = (0, _api.makeCustomFilter)(...args.patterns);
      break;

    case 'all':
    default:
  }

  const emitter = (0, _api.logkitty)({
    platform: platform,
    adbPath: args.adbPath ? String(args.adbPath) : '',
    priority: platform === 'android' ? (0, _utils.getMinPriority)(_api.AndroidPriority, selectedAndroidPriorities, _api.AndroidPriority.DEBUG) : (0, _utils.getMinPriority)(_api.IosPriority, selectedIosPriorities, _api.IosPriority.DEFAULT),
    filter: createFilter
  });
  emitter.on('entry', entry => {
    process.stdout.write((0, _formatters.formatEntry)(entry));
  });
  emitter.on('error', error => {
    terminate(error);
  });
} catch (error) {
  terminate(error);
}

function terminate(error) {
  // eslint-disable-next-line no-console
  console.log((0, _formatters.formatError)(error));
  process.exit(1);
}
//# sourceMappingURL=cli.js.map