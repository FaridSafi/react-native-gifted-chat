const path = require('path')

module.exports = function (api) {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          resolvePath: (sourcePath, currentFile, opts) => {
            if (/react\-native\-gifted\-chat/ig.test(sourcePath)) {
              let relativePath = new Array(currentFile.replace(path.join(__dirname, '../'), '').split('/').length - 1).fill('..').join('/')
              relativePath = path.join(relativePath, 'src', sourcePath.replace(/react\-native\-gifted\-chat(?:\/src)?/ig, ''))
              return relativePath
            }

            return sourcePath
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
