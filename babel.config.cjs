module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      '@babel/preset-env',
      'module:@react-native/babel-preset',
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-transform-unicode-property-regex',
      '@babel/plugin-transform-react-jsx',
      'react-native-reanimated/plugin',
    ],
  }
}
