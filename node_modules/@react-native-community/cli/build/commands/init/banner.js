"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reactLogoArray = ['                                                          ', '               ######                ######               ', '             ###     ####        ####     ###             ', '            ##          ###    ###          ##            ', '            ##             ####             ##            ', '            ##             ####             ##            ', '            ##           ##    ##           ##            ', '            ##         ###      ###         ##            ', '             ##  ########################  ##             ', '          ######    ###            ###    ######          ', '      ###     ##    ##              ##    ##     ###      ', '   ###         ## ###      ####      ### ##         ###   ', '  ##           ####      ########      ####           ##  ', ' ##             ###     ##########     ###             ## ', '  ##           ####      ########      ####           ##  ', '   ###         ## ###      ####      ### ##         ###   ', '      ###     ##    ##              ##    ##     ###      ', '          ######    ###            ###    ######          ', '             ##  ########################  ##             ', '            ##         ###      ###         ##            ', '            ##           ##    ##           ##            ', '            ##             ####             ##            ', '            ##             ####             ##            ', '            ##          ###    ###          ##            ', '             ###     ####        ####     ###             ', '               ######                ######               ', '                                                          '];
const welcomeMessage = '                  Welcome to React Native!                ';
const learnOnceMessage = '                 Learn once, write anywhere               ';
var _default = `${_chalk().default.blue(reactLogoArray.join('\n'))}

${_chalk().default.blue.bold(welcomeMessage)}
${_chalk().default.dim(learnOnceMessage)}
`;
exports.default = _default;