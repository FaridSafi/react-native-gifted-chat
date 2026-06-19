# Changelog

> **Maintenance notice:** Active development has moved to **[@kesha-antonov/react-native-chat](https://www.npmjs.com/package/@kesha-antonov/react-native-chat)**. This package is now in maintenance mode and won't receive new features. See the fork for streaming AI messages and ongoing updates. Migrating is mostly a rename - see the fork's migration guide.

## [3.4.1] - 2026-06-19

### ✨ Features
- **Emoji message reactions** ([#2725](https://github.com/FaridSafi/react-native-gifted-chat/issues/2725)): long-press a message to react with emojis; reactions render as toggleable pills below the bubble. Adds the `reactions` prop on `<GiftedChat>`, the `MessageReactions` display and a lightweight `ReactionPicker`, the `MessageReaction` model, and `IMessage.reactions`. A full emoji browser can be supplied via `renderReactionPicker`.
- **Animated day header `isAnimated` flag** ([#2721](https://github.com/FaridSafi/react-native-gifted-chat/issues/2721), [#2748](https://github.com/FaridSafi/react-native-gifted-chat/issues/2748)): `renderDay` now receives an `isAnimated` flag so custom day renderers can style the floating/sticky header differently from inline day separators.

### 🐛 Bug Fixes
- Animated day header showed the wrong date while scrolling ([#2709](https://github.com/FaridSafi/react-native-gifted-chat/issues/2709), [#2746](https://github.com/FaridSafi/react-native-gifted-chat/issues/2746)).
- Duplicate day badge produced by the animated header ([#2709](https://github.com/FaridSafi/react-native-gifted-chat/issues/2709), [#2747](https://github.com/FaridSafi/react-native-gifted-chat/issues/2747)).
- Reworked the animated day header into a Telegram-style sticky push for smoother transitions.
- Auto-scroll to the newest message when `inverted` is `false` ([#2612](https://github.com/FaridSafi/react-native-gifted-chat/issues/2612), [#2745](https://github.com/FaridSafi/react-native-gifted-chat/issues/2745)).
- Composer not resizing after send; added a `disableKeyboardProvider` opt-out for custom keyboard setups.

### 🔧 Improvements
- Refactored the animated day header (DRY, with a reusable debug helper).
- Added a **Day Animated** example screen and tidied the example chat header.
- Refreshed lockfiles to pull in-range security patches ([#2744](https://github.com/FaridSafi/react-native-gifted-chat/issues/2744)) and bumped transitive deps (launch-editor, brace-expansion, yaml, flatted, lodash, shell-quote, @babel/core).
- CI: dropped EOL Node 20 (now tests on Node 22 and 24), install example deps so lint can resolve example imports, and stopped tracking `example/ios`.

### 📝 Documentation
- Documented emoji reactions in the README with screenshots and linked the Features list to their sections.

### 🗒️ Maintenance
- Entered maintenance mode. Added an install-time notice pointing to the maintained fork **[@kesha-antonov/react-native-chat](https://www.npmjs.com/package/@kesha-antonov/react-native-chat)** (printed once on install; silence with `GIFTED_CHAT_NO_NOTICE=1`). No API or runtime changes.

## [3.4.0] - 2026-06-16

### ✨ Features
- **react-native-gesture-handler v3 support** ([#2739](https://github.com/FaridSafi/react-native-gifted-chat/issues/2739)): the library now works with both RNGH 2 and 3. RNGH 3 removed the `Text` re-export, so `Text` is now imported from `react-native` across all components. The `peerDependencies` range (`react-native-gesture-handler: ">=2.0.0"`) already spans both majors.

### 🐛 Bug Fixes
- Fixed [#2714](https://github.com/FaridSafi/react-native-gifted-chat/issues/2714) - `MessageImage` `onPress` not firing on Android. The custom `TouchableOpacity`'s content view now sets `pointerEvents: 'none'` so the press reaches the gesture-handler `BaseButton` (iOS was unaffected).
- Verified [#603](https://github.com/FaridSafi/react-native-gifted-chat/issues/603) (default `text` prop cleared on initial render) is resolved by the current hooks architecture and added a regression test covering it.

### 🔧 Improvements
- Bumped `react-native-zoom-reanimated` to `^1.5.4` for gesture-type compatibility with RNGH 3.
- Upgraded the dev/test toolchain to the React Native 0.85 line (migrated to `@react-native/jest-preset`, eslint/typescript bumps, perfectionist v5).
- Example app upgraded to Expo SDK 56.

## [3.3.2] - 2026-01-22

### 🐛 Bug Fixes
- Fixed `React.memo` and `React.forwardRef` components not rendering correctly when passed as render props
  - `renderComponentOrElement` now properly handles components with `$$typeof` property
- Fixed layout jump on initial render - content now renders with `opacity: 0` until initialized
- Fixed keyboard vertical offset documentation and examples

### 🔧 Improvements
- Updated `keyboardVerticalOffset` documentation in README with clearer explanation
- Added `hidden` style for smoother initial render transitions

### 📝 Documentation
- Improved `keyboardVerticalOffset` section explaining that it equals distance from screen top to container top
- Added recommendation to use `useHeaderHeight()` from `@react-navigation/elements`

## [3.3.0] - 2026-01-21

### ✨ Features
- **Swipe to Reply**: New swipe-to-reply functionality using `ReanimatedSwipeable` (based on [#2692](https://github.com/FaridSafi/react-native-gifted-chat/issues/2692))
  - Replaced deprecated `Swipeable` with `ReanimatedSwipeable` from react-native-gesture-handler
  - Added `reply` prop to `GiftedChat` with grouped configuration options
  - Swipe direction support: `'left'` (swipe left, icon on right) or `'right'` (swipe right, icon on left)
  - Custom swipe action rendering via `renderAction`
  - Built-in animated `ReplyIcon` component
  - `ReplyPreview` component with smooth enter/exit animations
  - Reply message display in `Bubble` component via `messageReply` prop
- **New Props**:
  - `scrollToBottomContentStyle` - style for scroll to bottom button content

### 🐛 Bug Fixes
- Fixed [#2702](https://github.com/FaridSafi/react-native-gifted-chat/issues/2702) - typing issues
- Fixed [#2708](https://github.com/FaridSafi/react-native-gifted-chat/issues/2708) - component issues
- Fixed [#2607](https://github.com/FaridSafi/react-native-gifted-chat/issues/2607) - edge case handling
- Fixed [#2701](https://github.com/FaridSafi/react-native-gifted-chat/issues/2701) - rendering issues
- Fixed [#2691](https://github.com/FaridSafi/react-native-gifted-chat/issues/2691) - prop handling
- Fixed [#2688](https://github.com/FaridSafi/react-native-gifted-chat/issues/2688) - style issues
- Fixed [#2687](https://github.com/FaridSafi/react-native-gifted-chat/issues/2687) - component behavior
- Fixed [#2618](https://github.com/FaridSafi/react-native-gifted-chat/issues/2618) - scroll issues
- Fixed [#2677](https://github.com/FaridSafi/react-native-gifted-chat/issues/2677), [#2682](https://github.com/FaridSafi/react-native-gifted-chat/issues/2682), [#2602](https://github.com/FaridSafi/react-native-gifted-chat/issues/2602) - multiple fixes
- Fixed [#2684](https://github.com/FaridSafi/react-native-gifted-chat/issues/2684), [#2686](https://github.com/FaridSafi/react-native-gifted-chat/issues/2686) - component issues
- Fixed `onScroll` type definition
- Fixed messages padding
- Fixed SystemMessage styles
- Added missing worklets for animations
- Removed `ts-expect-error` for `requestAnimationFrame` (now properly typed for React Native)
- Fixed two typing issues ([#2698](https://github.com/FaridSafi/react-native-gifted-chat/issues/2698))

### 🔧 Improvements
- Grouped reply-related props into `ReplyProps` interface for cleaner API
- Added `SwipeToReplyProps` for Message-level swipe configuration
- Added `BubbleReplyProps` for Bubble-level reply message styling
- Added example app to lint command with proper path alias support
- Improved reply animations (enter/exit transitions)
- Changes from [#2705](https://github.com/FaridSafi/react-native-gifted-chat/issues/2705)

### 📝 Documentation
- Updated README with swipe-to-reply feature documentation and examples
- Updated license link
- Added reply message implementation example ([#2690](https://github.com/FaridSafi/react-native-gifted-chat/issues/2690))

### 🧪 Testing
- Updated test snapshots
- Added tests for `MessageReply` component
- Added tests for `ReplyPreview` component

## [3.2.3] - 2025-12-XX

### 🐛 Bug Fixes
- Fixed `onScroll` type definition

## [3.2.0] - 2025-11-25

### ✨ Features
- **Custom Link Parser**: Replaced `react-native-autolink` dependency with custom link parser implementation for better control and performance
  - Removed external dependency on `react-native-autolink`
  - Improved link parsing with custom implementation in `linkParser.tsx`
  - Updated `MessageText` component to use new parser
  - Enhanced links example in example app

### 🐛 Bug Fixes
- Adjusted message bubble styles for better rendering
- Updated test snapshots to reflect parser changes

## [3.1.5] - 2025-11-25

### ✨ Features
- **Color Scheme Support**: Added `colorScheme` prop to `GiftedChat` component
  - New `useColorScheme` hook for consistent color scheme handling
  - Automatically adapts UI elements (Composer, InputToolbar, Send) based on color scheme
  - Added comprehensive tests for color scheme functionality

### 📝 Documentation
- Updated README with `colorScheme` prop documentation

## [3.1.4] - 2025-11-25

### 🐛 Bug Fixes
- Added left padding to `TextInput` when no accessory is present for better visual alignment
- Adjusted input toolbar styles for improved layout

## [3.1.3] - 2025-11-25

### 🔧 Improvements
- Removed unused imports for cleaner codebase

## [3.1.2] - 2025-11-24

### 🐛 Bug Fixes
- Fixed message bubble styles for small messages
- Improved rendering of compact message content

### 🧪 Testing
- Updated test snapshots

## [3.1.1] - 2025-11-24

### 🐛 Bug Fixes
- Fixed Bubble component styles for better message rendering
- Corrected style inconsistencies in message bubbles

### 🧪 Testing
- Updated test snapshots to reflect style fixes

## [3.1.0] - 2025-11-24

### 🔧 Improvements
- Refactored component styles for better maintainability
- Updated Expo Snack example with latest changes

### 🧪 Testing
- Updated test snapshots

## [3.0.1] - 2025-11-24

### 🐛 Bug Fixes
- Fixed Composer auto-resize height behavior on web platform

### 🧪 Testing
- Updated test snapshots

## [3.0.0] - 2025-11-23

This is a major release with significant breaking changes, new features, and improvements. The library has been completely rewritten in TypeScript with improved type safety, better keyboard handling, and enhanced customization options.

### 🚨 Breaking Changes

#### Renamed Props (GiftedChat)
- `onInputTextChanged` → moved to `textInputProps.onChangeText` (follows React Native naming pattern)
- `alwaysShowSend` → `isSendButtonAlwaysVisible` (consistent boolean naming convention)
- `onPress` → `onPressMessage` (more specific naming)
- `onLongPress` → `onLongPressMessage` (more specific naming)
- `options` → `actions` (better semantic naming, different type signature)
- `optionTintColor` → `actionSheetOptionTintColor` (clearer naming)
- `renderUsernameOnMessage` → `isUsernameVisible` (consistent boolean naming)
- `showUserAvatar` → `isUserAvatarVisible` (consistent boolean naming)
- `showAvatarForEveryMessage` → `isAvatarVisibleForEveryMessage` (consistent boolean naming)
- `renderAvatarOnTop` → `isAvatarOnTop` (consistent boolean naming)
- `focusOnInputWhenOpeningKeyboard` → `shouldFocusInputOnKeyboardOpen` (consistent boolean naming)
- `messageContainerRef` → `messagesContainerRef` (typo fix)
- `alignTop` → `isAlignedTop` (consistent boolean naming)
- `inverted` → `isInverted` (consistent boolean naming)

#### Removed Props (GiftedChat)
- `bottomOffset` - use `keyboardAvoidingViewProps.keyboardVerticalOffset` instead
- `disableKeyboardController` - removed keyboard controller configuration
- `isKeyboardInternallyHandled` - keyboard handling now always uses react-native-keyboard-controller
- `lightboxProps` - custom Modal implementation replaced react-native-lightbox-v2
- `placeholder` - moved to `textInputProps.placeholder`
- `disableComposer` - moved to `textInputProps.editable={false}`
- `keyboardShouldPersistTaps` - moved to `listProps.keyboardShouldPersistTaps`
- `maxInputLength` - moved to `textInputProps.maxLength`
- `extraData` - moved to `listProps.extraData`
- `infiniteScroll` - use `loadEarlierMessagesProps.isInfiniteScrollEnabled` instead
- `parsePatterns` - removed, automatic link parsing improved

#### Props Moved to MessagesContainer (via spreading)
These props moved from `GiftedChatProps` to `MessagesContainerProps` but are still accessible on `GiftedChat` via prop spreading:
- `messages` - now in MessagesContainerProps
- `isTyping` - now in MessagesContainerProps (via TypingIndicatorProps)
- `loadEarlier` → `loadEarlierMessagesProps.isAvailable`
- `isLoadingEarlier` → `loadEarlierMessagesProps.isLoading`
- `onLoadEarlier` → `loadEarlierMessagesProps.onPress`
- `renderLoadEarlier` - now in MessagesContainerProps
- `renderDay` - now in MessagesContainerProps
- `renderMessage` - now in MessagesContainerProps
- `renderFooter` - now in MessagesContainerProps
- `renderChatEmpty` - now in MessagesContainerProps
- `scrollToBottomStyle` - now in MessagesContainerProps
- `isScrollToBottomEnabled` - now in MessagesContainerProps
- `scrollToBottomComponent` - now in MessagesContainerProps
- `onQuickReply` - now in MessagesContainerProps
- `listViewProps` → `listProps` (renamed in MessagesContainerProps)

#### Type Signature Changes
- `options`: changed from `{ [key: string]: () => void }` to `Array<{ title: string, action: () => void }>`
- `textInputProps`: changed from `object` to `Partial<React.ComponentProps<typeof TextInput>>`
- `renderInputToolbar`: now accepts `React.ComponentType | React.ReactElement | function | null` (can be component, element, function, or null)
- All callback props now use arrow function syntax instead of function syntax for better type inference

#### Dependency Changes
- Removed `react-native-lightbox-v2` (replaced with custom Modal implementation)
- Removed `react-native-iphone-x-helper` (deprecated)
- Removed `react-native-keyboard-controller` as direct dependency
- Added `react-native-keyboard-controller` as peer dependency (>=1.0.0)
- Added `react-native-gesture-handler` as peer dependency (>=2.0.0)
- Added `react-native-reanimated` support for v3 & v4
- Added `react-native-safe-area-context` as peer dependency (>=5.0.0)

### ✨ New Features

#### TypeScript Migration
- Complete conversion from JavaScript to TypeScript/TSX
- Improved type safety and IntelliSense support
- Better type definitions for all components and props
- Refactored types to arrow functions for better readability

#### Keyboard Handling
- New `keyboardTopToolbarHeight` prop for better keyboard customization
- New `keyboardAvoidingViewProps` to pass props to KeyboardAvoidingView from react-native-keyboard-controller
- Improved keyboard behavior and offset handling
- Consolidated keyboard configuration (removed individual keyboard props in favor of `keyboardAvoidingViewProps`)
- Fixed auto-grow text input behavior
- Better keyboard open/close transitions
- New `OverKeyboardView` component for MessageImage to keep keyboard open

#### Message Rendering
- `isDayAnimationEnabled` prop to control day separator animations
- Support for passing custom components in render functions
- Improved message parsing with better link detection
- Parse links in system messages (fixes [#2105](https://github.com/FaridSafi/react-native-gifted-chat/issues/2105))
- Better phone number parsing with custom matchers support
- Improved URL parsing (email, phone, URL detection)

#### UI & Styling
- Dark theme support in example app
- Safe area provider included in library
- Improved LoadEarlier messages logic
- Better themed styles implementation
- Fixed press animation for TouchableOpacity
- Replaced deprecated `TouchableWithoutFeedback` with `Pressable`
- Better scroll to bottom button behavior on Android

#### Image Viewing
- Custom Modal implementation replacing react-native-lightbox-v2
- Better image viewing experience with proper insets handling
- Improved MessageImage component

#### Accessibility & UX
- `renderTicks` prop for message status indicators
- Better scroll to bottom wrapper visibility handling
- `useCallbackThrottled` for improved scroll performance
- Allow passing children to SystemMessage
- Improved load earlier messages functionality

### 🐛 Bug Fixes

- Fixed duplicate paragraph tags in README
- Fixed scroll to bottom when `isScrollToBottomEnabled=false` ([#2652](https://github.com/FaridSafi/react-native-gifted-chat/issues/2652))
- Fixed TypeScript type inconsistencies and ESLint errors ([#2653](https://github.com/FaridSafi/react-native-gifted-chat/issues/2653))
- Fixed automatic scroll to bottom issues ([#2630](https://github.com/FaridSafi/react-native-gifted-chat/issues/2630), [#2621](https://github.com/FaridSafi/react-native-gifted-chat/issues/2621), [#2644](https://github.com/FaridSafi/react-native-gifted-chat/issues/2644))
- Fixed DayAnimated test import and added proper test coverage for renderDay prop
- Fixed not passed `isDayAnimationEnabled` prop
- Fixed MessageContainer scroll to bottom press on Android
- Fixed safer change ScrollToBottomWrapper visibility
- Fixed dependency cycles in imports
- Fixed MessageText container style
- Fixed reanimated issue in MessageContainer
- Fixed construct messages on send in example
- Fixed web support in example
- Fixed [#2659](https://github.com/FaridSafi/react-native-gifted-chat/issues/2659) (memoization issues)
- Fixed [#2640](https://github.com/FaridSafi/react-native-gifted-chat/issues/2640) (various bug fixes)
- Fixed show location in example
- Fixed errors in keyboard handling
- Fixed load earlier messages functionality
- Fixed Bubble type parameter to re-enable generics on message prop ([#2639](https://github.com/FaridSafi/react-native-gifted-chat/issues/2639))
- Fixed listViewProps typing with Partial<FlatListProps> ([#2628](https://github.com/FaridSafi/react-native-gifted-chat/issues/2628))
- Fixed MessageContainer to add renderDay prop and insert DayAnimated Component ([#2632](https://github.com/FaridSafi/react-native-gifted-chat/issues/2632))
- Fixed dateFormatCalendar default value in README

### 🔧 Improvements

#### Performance
- Memoized values & functions for better performance
- Better scroll performance with throttled callbacks
- Optimized re-renders

#### Code Quality
- Added ESLint with import sorting
- Fixed all examples with ESLint
- Improved code structure and organization
- Better error handling
- Cleaner prop passing and component structure

#### Testing
- All tests converted to TypeScript
- Updated snapshots for new components
- Run tests in correct timezone (Europe/Paris)
- Improved test coverage
- Added comprehensive copilot instructions with validated commands

#### Documentation
- Improved README structure and formatting
- Better prop documentation and grouping
- Added matchers example
- Added working Expo Snack link
- Better feature documentation
- Added maintainer section
- Improved previews and images
- Added export documentation
- Fixed formatting issues and typos
- Better keyboard props documentation

#### Example App
- Updated to latest React Native and Expo
- Added tabs with different chat examples
- Added working link to Expo Snack
- Better example organization
- Added dark theme support
- Removed padding from bottom of toolbar
- Added custom phone matcher example
- Switch to dev build in README
- Android: transparent navigation & status bars by default
- Better project structure with multiple example types

#### Build & Development
- Better dependency management
- Updated to Node.js >= 20
- Yarn 1.22.22+ as package manager
- Added stale workflow for issue management
- Script to rebuild native dependencies
- Improved local development setup

### 📦 Dependencies

#### Added
- `@expo/react-native-action-sheet`: ^4.1.1
- `@types/lodash.isequal`: ^4.5.8
- `dayjs`: ^1.11.19
- `lodash.isequal`: ^4.5.0
- `react-native-zoom-reanimated`: ^1.4.10

#### Peer Dependencies (now required)
- `react`: >=18.0.0
- `react-native`: *
- `react-native-gesture-handler`: >=2.0.0
- `react-native-keyboard-controller`: >=1.0.0
- `react-native-reanimated`: >=3.0.0 || ^4.0.0
- `react-native-safe-area-context`: >=5.0.0

### 🔄 Migration Guide

#### Update Prop Names
```javascript
// Before (v2.8.1)
<GiftedChat
  messages={messages}
  onInputTextChanged={handleTextChange}
  alwaysShowSend={true}
  onPress={handlePress}
  onLongPress={handleLongPress}
  options={{ 'Option 1': action1, 'Option 2': action2 }}
  optionTintColor="#007AFF"
  bottomOffset={100}
  placeholder="Type a message..."
  maxInputLength={1000}
  renderUsernameOnMessage={true}
  showUserAvatar={false}
  showAvatarForEveryMessage={false}
  renderAvatarOnTop={false}
  alignTop={false}
  inverted={true}
  loadEarlier={true}
  isLoadingEarlier={false}
  onLoadEarlier={handleLoadEarlier}
/>

// After (v3.0.0)
<GiftedChat
  messages={messages}
  textInputProps={{
    onChangeText: handleTextChange,
    placeholder: "Type a message...",
    maxLength: 1000
  }}
  isSendButtonAlwaysVisible={true}
  onPressMessage={handlePress}
  onLongPressMessage={handleLongPress}
  actions={[
    { title: 'Option 1', action: action1 },
    { title: 'Option 2', action: action2 }
  ]}
  actionSheetOptionTintColor="#007AFF"
  keyboardAvoidingViewProps={{ keyboardVerticalOffset: 100 }}
  isUsernameVisible={true}
  isUserAvatarVisible={false}
  isAvatarVisibleForEveryMessage={false}
  isAvatarOnTop={false}
  isAlignedTop={false}
  isInverted={true}
  loadEarlierMessagesProps={{
    isAvailable: true,
    isLoading: false,
    onPress: handleLoadEarlier
  }}
/>
```

#### Install Peer Dependencies
```bash
npm install react-native-gesture-handler react-native-keyboard-controller react-native-reanimated react-native-safe-area-context
# or
yarn add react-native-gesture-handler react-native-keyboard-controller react-native-reanimated react-native-safe-area-context
```

#### Update Image Lightbox
The library now uses a custom Modal implementation instead of react-native-lightbox-v2. If you were customizing the lightbox, you'll need to update your customization approach.

### 📝 Notes

- This version includes 170+ commits since v2.8.1
- Full TypeScript support with improved type definitions
- Better React Native compatibility (tested with RN 0.81.5)
- Improved React 19 support
- Better Expo integration

### 👥 Contributors

Special thanks to all contributors who made this release possible, including fixes and improvements from the community.

---

For detailed commit history, see: https://github.com/FaridSafi/react-native-gifted-chat/compare/2.8.1...3.0.0
