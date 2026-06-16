module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      'module:@react-native/babel-preset',
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-unicode-property-regex',
      '@babel/plugin-transform-react-jsx',
      'react-native-reanimated/plugin',
    ],
  }
}
