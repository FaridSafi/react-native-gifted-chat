module.exports = {
  preset: 'react-native',
  resetMocks: true,
  setupFiles: [
    './node_modules/react-native/jest-preset',
    // './node_modules/react-native/jest/setup.js',
    './tests/setup.js',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    uuid: require.resolve('uuid'),
  },
  transform: {
    '\\.js$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  transformIgnorePatterns: [],
  testMatch: ['**/*.test.ts?(x)'],
  modulePathIgnorePatterns: ['./example'],
  coveragePathIgnorePatterns: ['./src/__tests__/'],
}
