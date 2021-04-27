"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = linkAssets;

function _lodash() {
  const data = require("lodash");

  _lodash = function () {
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

function linkAssets(platforms, project, assets) {
  if ((0, _lodash().isEmpty)(assets)) {
    return;
  }

  Object.keys(platforms || {}).forEach(platform => {
    const linkConfig = platforms[platform] && platforms[platform].linkConfig && platforms[platform].linkConfig();

    if (!linkConfig || !linkConfig.copyAssets || !project[platform]) {
      return;
    }

    _cliTools().logger.info(`Linking assets to ${platform} project`);

    linkConfig.copyAssets(assets, project[platform]);
  });

  _cliTools().logger.success('Assets have been successfully linked to your project');
}