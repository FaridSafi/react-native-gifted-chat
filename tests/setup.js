require('react-native-reanimated').setUpTests()

// mocks
jest.mock('@expo/react-native-action-sheet', () => 'ActionSheet')
jest.mock('react-native-lightbox-v2', () => 'Lightbox')
