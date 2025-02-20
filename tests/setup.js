require('react-native-reanimated').setUpTests()

// mocks
jest.mock('react-native-lightbox-v2', () => 'Lightbox')
jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest'),
)
