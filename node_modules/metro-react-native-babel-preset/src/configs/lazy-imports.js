/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This is the set of modules that React Native publicly exports and that we
 * want to require lazily. Keep this list in sync with
 * Libraries/react-native/react-native-implementation.js (though having extra
 * entries here is fairly harmless).

 * @format
 */
"use strict";

module.exports = new Set([
  "AccessibilityInfo",
  "ActivityIndicator",
  "ReactNativeART",
  "Button",
  "CheckBox",
  "DatePickerIOS",
  "DrawerLayoutAndroid",
  "FlatList",
  "Image",
  "ImageBackground",
  "InputAccessoryView",
  "KeyboardAvoidingView",
  "MaskedViewIOS",
  "Modal",
  "Picker",
  "PickerIOS",
  "ProgressBarAndroid",
  "ProgressViewIOS",
  "SafeAreaView",
  "ScrollView",
  "SectionList",
  "SegmentedControlIOS",
  "Slider",
  "Switch",
  "RefreshControl",
  "StatusBar",
  "SwipeableFlatList",
  "Text",
  "TextInput",
  "Touchable",
  "TouchableHighlight",
  "TouchableNativeFeedback",
  "TouchableOpacity",
  "TouchableWithoutFeedback",
  "View",
  "VirtualizedList", // APIs
  "ActionSheetIOS",
  "Alert",
  "Animated",
  "AppRegistry",
  "AppState",
  "AsyncStorage",
  "BackHandler",
  "CameraRoll",
  "Clipboard",
  "DatePickerAndroid",
  "DeviceInfo",
  "Dimensions",
  "Easing",
  "ReactNative",
  "I18nManager",
  "InteractionManager",
  "Keyboard",
  "LayoutAnimation",
  "Linking",
  "NativeEventEmitter",
  "PanResponder",
  "PermissionsAndroid",
  "PixelRatio",
  "PushNotificationIOS",
  "Settings",
  "Share",
  "StatusBarIOS",
  "StyleSheet",
  "Systrace",
  "TimePickerAndroid",
  "ToastAndroid",
  "TVEventHandler",
  "UIManager",
  "ReactNative",
  "UTFSequence",
  "Vibration",
  "YellowBox", // Plugins
  "RCTDeviceEventEmitter",
  "RCTNativeAppEventEmitter",
  "NativeModules",
  "Platform",
  "processColor",
  "requireNativeComponent", // Prop Types
  "DeprecatedColorPropType",
  "DeprecatedEdgeInsetsPropType",
  "DeprecatedPointPropType",
  "DeprecatedViewPropTypes"
]);
