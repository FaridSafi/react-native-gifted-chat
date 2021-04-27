"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateProjectName = validateProjectName;

var _InvalidNameError = _interopRequireDefault(require("./errors/InvalidNameError"));

var _ReservedNameError = _interopRequireDefault(require("./errors/ReservedNameError"));

var _HelloWorldError = _interopRequireDefault(require("./errors/HelloWorldError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NAME_REGEX = /^[$A-Z_][0-9A-Z_$]*$/i; // ref: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html

const javaKeywords = ['abstract', 'continue', 'for', 'new', 'switch', 'assert', 'default', 'goto', 'package', 'synchronized', 'boolean', 'do', 'if', 'private', 'this', 'break', 'double', 'implements', 'protected', 'throw', 'byte', 'else', 'import', 'public', 'throws', 'case', 'enum', 'instanceof', 'return', 'transient', 'catch', 'extends', 'int', 'short', 'try', 'char', 'final', 'interface', 'static', 'void', 'class', 'finally', 'long', 'strictfp', 'volatile', 'const', 'float', 'native', 'super', 'while'];
const reservedNames = ['react', 'react-native', ...javaKeywords];

function validateProjectName(name) {
  if (!String(name).match(NAME_REGEX)) {
    throw new _InvalidNameError.default(name);
  }

  const lowerCaseName = name.toLowerCase();

  if (reservedNames.includes(lowerCaseName)) {
    throw new _ReservedNameError.default();
  }

  if (name.match(/helloworld/gi)) {
    throw new _HelloWorldError.default();
  }
}