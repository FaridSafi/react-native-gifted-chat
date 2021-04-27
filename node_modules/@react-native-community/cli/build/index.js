"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
Object.defineProperty(exports, "init", {
  enumerable: true,
  get: function () {
    return _initCompat.default;
  }
});
exports.bin = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _child_process() {
  const data = _interopRequireDefault(require("child_process"));

  _child_process = function () {
    return data;
  };

  return data;
}

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
    return data;
  };

  return data;
}

function _didyoumean() {
  const data = _interopRequireDefault(require("didyoumean"));

  _didyoumean = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _commands = require("./commands");

var _initCompat = _interopRequireDefault(require("./commands/init/initCompat"));

var _assertRequiredOptions = _interopRequireDefault(require("./tools/assertRequiredOptions"));

var _config = _interopRequireDefault(require("./tools/config"));

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander().default.option('--version', 'Print CLI version').option('--verbose', 'Increase logging verbosity');

_commander().default.arguments('<command>').action(cmd => {
  printUnknownCommand(cmd);
  process.exit(1);
});

const handleError = err => {
  if (_commander().default.verbose) {
    _cliTools().logger.error(err.message);
  } else {
    // Some error messages (esp. custom ones) might have `.` at the end already.
    const message = err.message.replace(/\.$/, '');

    _cliTools().logger.error(`${message}. ${_chalk().default.dim(`Run CLI with ${_chalk().default.reset('--verbose')} ${_chalk().default.dim('flag for more details.')}`)}`);
  }

  if (err.stack) {
    _cliTools().logger.log(_chalk().default.dim(err.stack));
  }

  process.exit(1);
};
/**
 * Custom printHelpInformation command inspired by internal Commander.js
 * one modified to suit our needs
 */


function printHelpInformation(examples, pkg) {
  let cmdName = this._name;

  const argsList = this._args.map(arg => arg.required ? `<${arg.name}>` : `[${arg.name}]`).join(' ');

  if (this._alias) {
    cmdName = `${cmdName}|${this._alias}`;
  }

  const sourceInformation = pkg ? [`${_chalk().default.bold('Source:')} ${pkg.name}@${pkg.version}`, ''] : [];
  let output = [_chalk().default.bold(`react-native ${cmdName} ${argsList}`), this._description ? `\n${this._description}\n` : '', ...sourceInformation, `${_chalk().default.bold('Options:')}`, this.optionHelp().replace(/^/gm, '  ')];

  if (examples && examples.length > 0) {
    const formattedUsage = examples.map(example => `  ${example.desc}: \n  ${_chalk().default.cyan(example.cmd)}`).join('\n\n');
    output = output.concat([_chalk().default.bold('\nExample usage:'), formattedUsage]);
  }

  return output.join('\n').concat('\n');
}

function printUnknownCommand(cmdName) {
  const suggestion = (0, _didyoumean().default)(cmdName, _commander().default.commands.map(cmd => cmd._name));
  let errorMsg = `Unrecognized command "${_chalk().default.bold(cmdName)}".`;

  if (suggestion) {
    errorMsg += ` Did you mean "${suggestion}"?`;
  }

  if (cmdName) {
    _cliTools().logger.error(errorMsg);

    _cliTools().logger.info(`Run ${_chalk().default.bold('"react-native --help"')} to see a list of all available commands.`);
  } else {
    _commander().default.outputHelp();
  }
}
/**
 * Custom type assertion needed for the `makeCommand` conditional
 * types to be properly resolved.
 */


const isDetachedCommand = command => {
  return command.detached === true;
};
/**
 * Attaches a new command onto global `commander` instance.
 *
 * Note that this function takes additional argument of `Config` type in case
 * passed `command` needs it for its execution.
 */


function attachCommand(command, ...rest) {
  const options = command.options || [];

  const cmd = _commander().default.command(command.name).action(async function handleAction(...args) {
    const passedOptions = this.opts();
    const argv = Array.from(args).slice(0, -1);

    try {
      (0, _assertRequiredOptions.default)(options, passedOptions);

      if (isDetachedCommand(command)) {
        await command.func(argv, passedOptions);
      } else {
        await command.func(argv, rest[0], passedOptions);
      }
    } catch (error) {
      handleError(error);
    }
  });

  if (command.description) {
    cmd.description(command.description);
  }

  cmd.helpInformation = printHelpInformation.bind(cmd, command.examples, command.pkg);

  for (const opt of command.options || []) {
    cmd.option(opt.name, opt.description, opt.parse || (val => val), typeof opt.default === 'function' ? opt.default(rest[0]) : opt.default);
  }
}

async function run() {
  try {
    await setupAndRun();
  } catch (e) {
    handleError(e);
  }
}

async function setupAndRun() {
  // Commander is not available yet
  _cliTools().logger.setVerbose(process.argv.includes('--verbose')); // We only have a setup script for UNIX envs currently


  if (process.platform !== 'win32') {
    const scriptName = 'setup_env.sh';

    const absolutePath = _path().default.join(__dirname, '..', scriptName);

    try {
      _child_process().default.execFileSync(absolutePath, {
        stdio: 'pipe'
      });
    } catch (error) {
      _cliTools().logger.warn(`Failed to run environment setup script "${scriptName}"\n\n${_chalk().default.red(error)}`);

      _cliTools().logger.info(`React Native CLI will continue to run if your local environment matches what React Native expects. If it does fail, check out "${absolutePath}" and adjust your environment to match it.`);
    }
  }

  for (const command of _commands.detachedCommands) {
    attachCommand(command);
  }

  try {
    // when we run `config`, we don't want to output anything to the console. We
    // expect it to return valid JSON
    if (process.argv.includes('config')) {
      _cliTools().logger.disable();
    }

    const ctx = (0, _config.default)();

    _cliTools().logger.enable();

    for (const command of [..._commands.projectCommands, ...ctx.commands]) {
      attachCommand(command, ctx);
    }
  } catch (e) {
    _cliTools().logger.enable();

    _cliTools().logger.debug(e.message);

    _cliTools().logger.debug('Failed to load configuration of your project. Only a subset of commands will be available.');
  }

  _commander().default.parse(process.argv);

  if (_commander().default.rawArgs.length === 2) {
    _commander().default.outputHelp();
  } // We handle --version as a special case like this because both `commander`
  // and `yargs` append it to every command and we don't want to do that.
  // E.g. outside command `init` has --version flag and we want to preserve it.


  if (_commander().default.args.length === 0 && _commander().default.rawArgs.includes('--version')) {
    console.log(_package.default.version);
  }
}

const bin = require.resolve("./bin");

exports.bin = bin;