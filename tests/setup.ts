require('react-native-reanimated').setUpTests()

// mocks
jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest')
)
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View')
  const FlatList = require('react-native/Libraries/Lists/FlatList')
  return {
    TouchableWithoutFeedback: View,
    TouchableHighlight: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: FlatList,
    Pressable: View,
    GestureHandlerRootView: View,
    gestureHandlerRootHOC: jest.fn(component => component),
    Directions: {},
  }
})
