const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const path = require('path')
const config = {};

config.watchFolders = [
  path.resolve(__dirname, '../src'),
]

config.resolver = {
  extraNodeModules: new Proxy(
    {},
    {
      get: (target, name) => {
        if (target.hasOwnProperty(name)) {
          return target[name]
        }
        if (name === 'react-native-gifted-chat') {
          return path.join(process.cwd(), `../src`)
        }
        return path.join(process.cwd(), `node_modules/${name}`)
      },
    },
  ),
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
