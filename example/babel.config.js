console.log('babel')

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver', {
          root: ['.'],
          alias: {
            'react-native-gifted-chat': '../src',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
