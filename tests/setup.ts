jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock')
)

jest.mock('react-native-reanimated', () => {
  // Reanimated deliberately selects its JS-only module under Jest, but since 4.6 the native
  // initializer unconditionally installs a CSS event handler - and that module's
  // `setCSSEventHandler` throws. Loading the library's own mock crashes on the way in, so
  // neutralise the one method first. Nothing here animates via CSS, so a noop is enough.
  const {
    createJSReanimatedModule,
  } = require('react-native-reanimated/src/ReanimatedModule/js-reanimated/JSReanimated')

  Object.getPrototypeOf(createJSReanimatedModule()).setCSSEventHandler = () => {}

  const Reanimated = require('react-native-reanimated/mock')
  // The reanimated mock ships isSharedValue as an empty "ADD ME IF NEEDED" stub,
  // but react-native-gesture-handler 3 probes Reanimated.isSharedValue on import.
  // Mirror reanimated's real implementation so RNGH 3 works under the test mock.
  Reanimated.isSharedValue = (value: any) => value?._isReanimatedSharedValue === true
  return Reanimated
})

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
