/* global console, process, YAML_SILENCE_DEPRECATION_WARNINGS, YAML_SILENCE_WARNINGS */
function shouldWarn(deprecation) {
  var env = typeof process !== 'undefined' && process.env || {};

  if (deprecation) {
    if (typeof YAML_SILENCE_DEPRECATION_WARNINGS !== 'undefined') return !YAML_SILENCE_DEPRECATION_WARNINGS;
    return !env.YAML_SILENCE_DEPRECATION_WARNINGS;
  }

  if (typeof YAML_SILENCE_WARNINGS !== 'undefined') return !YAML_SILENCE_WARNINGS;
  return !env.YAML_SILENCE_WARNINGS;
}

export function warn(warning, type) {
  if (shouldWarn(false)) {
    var emit = typeof process !== 'undefined' && process.emitWarning; // This will throw in Jest if `warning` is an Error instance due to
    // https://github.com/facebook/jest/issues/2549

    if (emit) emit(warning, type);else {
      // eslint-disable-next-line no-console
      console.warn(type ? "".concat(type, ": ").concat(warning) : warning);
    }
  }
}
export function warnFileDeprecation(filename) {
  if (shouldWarn(true)) {
    var path = filename.replace(/.*yaml[/\\]/i, '').replace(/\.js$/, '').replace(/\\/g, '/');
    warn("The endpoint 'yaml/".concat(path, "' will be removed in a future release."), 'DeprecationWarning');
  }
}
var warned = {};
export function warnOptionDeprecation(name, alternative) {
  if (!warned[name] && shouldWarn(true)) {
    warned[name] = true;
    var msg = "The option '".concat(name, "' will be removed in a future release");
    msg += alternative ? ", use '".concat(alternative, "' instead.") : '.';
    warn(msg, 'DeprecationWarning');
  }
}