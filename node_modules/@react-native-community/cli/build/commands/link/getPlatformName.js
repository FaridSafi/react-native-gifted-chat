"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPlatformName;
const names = {
  ios: 'iOS',
  android: 'Android'
};

function getPlatformName(name) {
  return names[name] || name;
}