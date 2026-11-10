// Time snapshots render local time, so pin the zone - otherwise they change with the
// machine's timezone and with daylight saving.
process.env.TZ = 'UTC'

module.exports = {
  preset: '@react-native/jest-preset',
  resetMocks: true,
  setupFilesAfterEnv: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './tests/setup.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  transform: {
    '\\.js$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@expo|expo))',
  ],
  testMatch: ['**/*.test.ts?(x)'],
  modulePathIgnorePatterns: ['./example'],
  coveragePathIgnorePatterns: ['./src/__tests__/'],
}
