const { getDefaultConfig } = require('@expo/metro-config')
const path = require('path')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.watchFolders = [
  ...defaultConfig.watchFolders,
  path.resolve(__dirname, '../src'),
]

defaultConfig.resolver.extraNodeModules = new Proxy(
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
)

module.exports = defaultConfig
