jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock')
)

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
)

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 }
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaInsetsContext: {
      Consumer: ({ children }: any) => children(inset),
    },
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  }
})

jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest')
)
