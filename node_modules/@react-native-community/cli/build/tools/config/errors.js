"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JoiError = void 0;

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

class JoiError extends _cliTools().CLIError {
  constructor(joiError) {
    super(joiError.details.map(error => {
      const name = error.path.join('.');

      switch (error.type) {
        case 'object.allowUnknown':
          {
            const value = JSON.stringify(error.context && error.context.value);
            return `
                Unknown option ${name} with value "${value}" was found.
                This is either a typing error or a user mistake. Fixing it will remove this message.
              `;
          }

        case 'object.base':
        case 'string.base':
          {
            const expectedType = error.type.replace('.base', '');
            const actualType = typeof (error.context && error.context.value);
            return `
                Option ${name} must be a ${expectedType}, instead got ${actualType}
              `;
          }

        default:
          return error.message;
      }
    }).join());
  }

}

exports.JoiError = JoiError;