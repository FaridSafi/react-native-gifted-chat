const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Point to the parent directory (the library root)
const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')

// Watch the parent directory for changes
config.watchFolders = [workspaceRoot]

// Resolve react-native-gifted-chat from the local src directory
config.resolver.extraNodeModules = {
  'react-native-gifted-chat': path.resolve(workspaceRoot, 'src'),
}

// Ensure we're resolving from both the project and workspace
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// Ensure TypeScript files are resolved
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'tsx', 'ts']

module.exports = config
