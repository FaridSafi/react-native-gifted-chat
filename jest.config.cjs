module.exports = {
  preset: 'react-native',
  resetMocks: true,
  setupFilesAfterEnv: [
    './node_modules/react-native/jest-preset',
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './tests/setup.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  transform: {
    '\\.js$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  transformIgnorePatterns: [],
  testMatch: ['**/*.test.ts?(x)'],
  modulePathIgnorePatterns: ['./example'],
  coveragePathIgnorePatterns: ['./src/__tests__/'],
}
