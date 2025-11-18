# Changelog: v2.8.1 to v2.8.2-alpha.5

## 🚨 BREAKING CHANGES

### Removed Dependencies
- **Removed `react-native-lightbox-v2`**: The library now uses a custom Modal implementation for viewing images
  - ❌ Removed prop: `lightboxProps` from `MessageImageProps`
  - ❌ Removed prop: `lightboxProps` from `GiftedChatProps`
  - The image viewer now uses `react-native-zoom-reanimated` for zoom functionality

### New Required Peer Dependencies
- ✅ **`react-native-gesture-handler`** (>=2.0.0) - now required
- ✅ **`react-native-safe-area-context`** (>=5.0.0) - now required
- Updated **`react-native-reanimated`** peer dependency to support both v3 and v4 (>=3.0.0 || ^4.0.0)

### Renamed Props (GiftedChatProps)

#### Action Sheet Props
- ❌ `options` → ✅ `actions` (type changed from `{ [key: string]: () => void }` to `Array<{ title: string, action: () => void }>`)
- ❌ `optionTintColor` → ✅ `actionSheetOptionTintColor`

#### Keyboard Props
- ❌ `bottomOffset` → ✅ `keyboardBottomOffset`

#### Message Event Handlers
- ❌ `onPress` → ✅ `onPressMessage`
- ❌ `onLongPress` → ✅ `onLongPressMessage`

#### LoadEarlier Component
- ❌ `LoadEarlier` → ✅ `LoadEarlierMessages` (component renamed)
- ❌ `LoadEarlierProps` → ✅ `LoadEarlierMessagesProps` (type renamed)

### Removed Props (GiftedChatProps)

#### Keyboard & Input Props
- ❌ `keyboardShouldPersistTaps` - removed (keyboard handling is now managed internally)
- ❌ `maxInputLength` - removed (use `textInputProps.maxLength` instead)
- ❌ `placeholder` - removed (use `textInputProps.placeholder` instead)
- ❌ `disableComposer` - removed (use `textInputProps.editable={false}` instead)

#### Load Earlier Props
- ❌ `loadEarlier` - removed (use `loadEarlierMessagesProps` instead)
- ❌ `isLoadingEarlier` - removed (use `loadEarlierMessagesProps` instead)
- ❌ `onLoadEarlier` - removed (use `loadEarlierMessagesProps.onLoadEarlier` instead)
- ❌ `renderLoadEarlier` - removed (use `loadEarlierMessagesProps.renderLoadEarlier` instead)
- ❌ `infiniteScroll` - removed

#### ListView & Layout Props
- ❌ `alignTop` - removed
- ❌ `listViewProps` - removed
- ❌ `extraData` - removed
- ❌ `isScrollToBottomEnabled` - removed
- ❌ `scrollToBottomStyle` - removed
- ❌ `scrollToBottomComponent` - removed

#### Render Props
- ❌ `renderMessage` - removed
- ❌ `renderFooter` - removed
- ❌ `renderChatEmpty` - removed
- ❌ `renderDay` - removed

#### Quick Replies
- ❌ `onQuickReply` - removed

#### Parse Patterns
- ❌ `parsePatterns` - removed (replaced with `matchers`)

### Removed Props (ComposerProps)
- ❌ `placeholder` - removed (use `textInputProps.placeholder` instead)
- ❌ `placeholderTextColor` - removed (use `textInputProps.placeholderTextColor` instead)

### Removed Props (InputToolbarProps)
- ❌ `options` → ✅ `actions` (renamed)
- ❌ `optionTintColor` → ✅ `actionSheetOptionTintColor` (renamed)

### Changed Props (GiftedChatProps)

#### Type Changes
- `textInputProps`: Changed from `object` to `Partial<React.ComponentProps<typeof TextInput>>`
  - Now properly typed with all TextInput props available
  - Use this for `placeholder`, `placeholderTextColor`, `maxLength`, `editable`, etc.

#### MessageContainer Props
- `invertibleScrollViewProps` removed - use individual props instead:
  - `inverted` prop now passed directly
  - Removed `keyboardShouldPersistTaps` (handled internally)

#### Link Parsing
- ❌ `parsePatterns` → ✅ `matchers`
  - Now uses `react-native-autolink` instead of `react-native-parsed-text`
  - See [react-native-autolink documentation](https://github.com/joshswan/react-native-autolink) for matcher configuration

### New Props

#### GiftedChatProps
- ✅ `messageTextProps` - Extra props to be passed to the MessageText component
- ✅ `matchers` - Custom parse patterns for react-native-autolink (replaces `parsePatterns`)
- ✅ `keyboardBottomOffset` - Distance of the chat from the bottom of the screen (replaces `bottomOffset`)
- ✅ `actions` - Array of action sheet options (replaces `options`)
- ✅ `actionSheetOptionTintColor` - Tint color for action sheet (replaces `optionTintColor`)

#### IMessage Interface
- ✅ `location` - Optional location data with latitude and longitude:
  ```typescript
  location?: {
    latitude: number
    longitude: number
  }
  ```

## 📦 Migration Guide

### 1. Install New Dependencies

```bash
# Yarn
yarn add react-native-gesture-handler react-native-safe-area-context

# npm
npm install react-native-gesture-handler react-native-safe-area-context

# Expo
npx expo install react-native-gesture-handler react-native-safe-area-context
```

### 2. Update Imports

If you were importing `LoadEarlier`:
```typescript
// Before
import { LoadEarlier, LoadEarlierProps } from 'react-native-gifted-chat'

// After
import { LoadEarlierMessages, LoadEarlierMessagesProps } from 'react-native-gifted-chat'
```

### 3. Update Props

#### Action Sheet Props
```typescript
// Before
<GiftedChat
  options={{
    'Action 1': () => console.log('Action 1'),
    'Action 2': () => console.log('Action 2'),
  }}
  optionTintColor="#007AFF"
/>

// After
<GiftedChat
  actions={[
    { title: 'Action 1', action: () => console.log('Action 1') },
    { title: 'Action 2', action: () => console.log('Action 2') },
  ]}
  actionSheetOptionTintColor="#007AFF"
/>
```

#### Keyboard Offset
```typescript
// Before
<GiftedChat bottomOffset={50} />

// After
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function MyChat() {
  const insets = useSafeAreaInsets()
  const tabbarHeight = 50
  const keyboardBottomOffset = insets.bottom + tabbarHeight

  return <GiftedChat keyboardBottomOffset={keyboardBottomOffset} />
}
```

#### Message Press Handlers
```typescript
// Before
<GiftedChat
  onPress={(context, message) => console.log('Pressed')}
  onLongPress={(context, message) => console.log('Long pressed')}
/>

// After
<GiftedChat
  onPressMessage={(context, message) => console.log('Pressed')}
  onLongPressMessage={(context, message) => console.log('Long pressed')}
/>
```

#### Text Input Props
```typescript
// Before
<GiftedChat
  placeholder="Type a message..."
  maxInputLength={1000}
  disableComposer={false}
/>

// After
<GiftedChat
  textInputProps={{
    placeholder: "Type a message...",
    maxLength: 1000,
    editable: true,
  }}
/>
```

#### Load Earlier Messages
```typescript
// Before
<GiftedChat
  loadEarlier={true}
  isLoadingEarlier={isLoading}
  onLoadEarlier={handleLoadEarlier}
  renderLoadEarlier={(props) => <CustomLoadEarlier {...props} />}
/>

// After
<GiftedChat
  loadEarlierMessagesProps={{
    loadEarlier: true,
    isLoadingEarlier: isLoading,
    onLoadEarlier: handleLoadEarlier,
    renderLoadEarlier: (props) => <CustomLoadEarlier {...props} />,
  }}
/>
```

#### Link Parsing
```typescript
// Before
<GiftedChat
  parsePatterns={(linkStyle) => [
    { pattern: /#(\w+)/, style: linkStyle, onPress: (tag) => console.log(tag) },
  ]}
/>

// After
<GiftedChat
  matchers={[
    {
      pattern: /#(\w+)/,
      style: { color: 'blue' },
      onPress: (url, match) => console.log(match),
    },
  ]}
/>
```

#### Lightbox Props (Image Viewer)
```typescript
// Before
<GiftedChat
  lightboxProps={{
    backgroundColor: 'black',
    // other lightbox props
  }}
/>

// After
// Custom image viewer is now built-in with react-native-zoom-reanimated
// No props needed - just works out of the box
<GiftedChat />
```

## ✨ New Features

### TypeScript Improvements
- Complete TypeScript conversion of the library
- Better type safety for all props
- Properly typed `textInputProps` with TextInput component types

### Keyboard Handling
- Improved keyboard handling with `react-native-keyboard-controller`
- Better support for safe areas
- More predictable keyboard offset behavior

### Image Viewer
- Custom built-in image viewer using `react-native-zoom-reanimated`
- No external lightbox dependency needed
- Better cross-platform support (including web)

### SafeArea Integration
- Built-in SafeAreaProvider integration
- Better handling of notches and device-specific layouts

### Link Parsing
- Upgraded from `react-native-parsed-text` to `react-native-autolink`
- Better URL, email, and phone number detection
- More customizable matchers

### Load Earlier Messages
- Improved load earlier messages logic
- Better UX with proper safe area handling
- Consolidated props under `loadEarlierMessagesProps`

## 🐛 Bug Fixes

- Fixed scroll to bottom behavior on Android
- Fixed load earlier messages display
- Fixed keyboard offset calculations
- Fixed TypeScript type inconsistencies
- Fixed ESLint errors throughout the codebase
- Fixed snapshot tests
- Fixed message container reanimated issues
- Fixed DayAnimated component and proper test coverage for renderDay prop
- Fixed automatic scroll to bottom when `isScrollToBottomEnabled=false`
- Fixed MessageText container styles
- Fixed construct messages on send in examples

## 🔧 Internal Improvements

- Converted JavaScript to TypeScript throughout the library
- Improved ESLint configuration with import sorting
- Added support for Reanimated v3 and v4
- Memoized values and functions for better performance
- Better themed styles refactoring
- Improved example app with tabs and different examples
- Updated to latest React Native, Expo, and dependency versions
- Removed unused dependencies (`react-native-iphone-x-helper`, `react-native-lightbox-v2`)
- Replaced deprecated `TouchableWithoutFeedback` with `Pressable`
- Added useCallbackThrottled for better scroll to bottom visibility
- Removed redundant TextInput configs

## 📚 Documentation Updates

- Updated README with new installation instructions
- Added working Expo Snack link
- Better structure for props documentation
- Added missing props to README
- Fixed broken links
- Added dark theme support in examples
- Better keyboard offset documentation
- Improved example readmes

## 🧪 Testing

- Fixed tests to run in correct timezone (Europe/Paris)
- Updated snapshots for new components
- Added proper test coverage for DayAnimated
- Fixed test setup and configuration

## 📋 Repository Changes

- Added GitHub stale workflow
- Removed package-lock.json (yarn-only repository)
- Updated Node.js engine requirement to >=20
- Various CI/CD improvements

## ⚠️ Important Notes

1. **This is an alpha release** - Test thoroughly before using in production
2. **Backup your code** before upgrading
3. **Review all prop changes** - Many props have been renamed or removed
4. **New peer dependencies** - Make sure to install `react-native-gesture-handler` and `react-native-safe-area-context`
5. **TypeScript users** - You may need to update type imports and usages
6. **Keyboard behavior** - The keyboard is now handled internally by default. Set `isKeyboardInternallyHandled={false}` if you have custom keyboard handling
7. **Safe areas** - The library now includes SafeAreaProvider internally, but you should still wrap your app with it for best results

## 📊 Version History

- **2.8.1** - Last stable release
- **2.8.2-alpha.0** - Initial alpha release
- **2.8.2-alpha.5** - Current alpha release (this changelog)

---

For issues or questions, please visit: https://github.com/FaridSafi/react-native-gifted-chat/issues
