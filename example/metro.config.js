/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
*
* @type {import('metro-config').MetroConfig}
*/

/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')
/* eslint-enable @typescript-eslint/no-require-imports */
const config = {}

config.watchFolders = [
  path.resolve(__dirname, '../src'),
]

config.resolver = {
  extraNodeModules: new Proxy(
    {},
    {
      get: (target, name) => {
        // console.log(`example/metro name: ${name}`, Object.prototype.hasOwnProperty.call(target, name))
        if (Object.prototype.hasOwnProperty.call(target, name))
          return target[name]

        if (name === 'react-native-gifted-chat')
          return path.join(process.cwd(), '../src')

        return path.join(process.cwd(), `node_modules/${name}`)
      },
    }
  ),
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
