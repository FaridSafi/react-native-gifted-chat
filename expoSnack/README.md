# React Native Gifted Chat - Expo Snack

This directory contains a self-contained Expo Snack example that demonstrates the full capabilities of React Native Gifted Chat.

## 🚀 Quick Start

### Option 1: Use Expo Snack (Recommended)

1. Go to [https://snack.expo.dev](https://snack.expo.dev)
2. Click "Create a new Snack"
3. Copy the entire contents of `ExpoSnack.tsx` from this repository
4. Replace the default `App.tsx` content with the copied code
5. Install dependencies (see below)
6. Run on your device or simulator

### Option 2: Use in Your Project

Simply copy `ExpoSnack.tsx` into your Expo project and ensure all dependencies are installed.

## 📦 Required Dependencies

Add these dependencies to your Expo Snack or project:

```json
{
  "dependencies": {
    "react-native-gifted-chat": "*",
    "react-native-gesture-handler": "*",
    "react-native-safe-area-context": "*",
    "react-native-reanimated": "*",
    "@expo/react-native-action-sheet": "*",
    "@expo/vector-icons": "*",
    "expo-image-picker": "*",
    "expo-location": "*",
    "expo-linking": "*",
    "react-native-maps": "*",
    "dayjs": "*"
  }
}
```

### In Expo Snack:

1. Click on the "Dependencies" tab in the left sidebar
2. Search for and add each dependency listed above
3. Wait for the dependencies to install

## ✨ Features Demonstrated

This example showcases all major features of React Native Gifted Chat:

### Core Features
- ✅ Text messaging with bubbles
- ✅ User avatars and names
- ✅ Message timestamps
- ✅ Typing indicator
- ✅ Load earlier messages
- ✅ Dark mode support

### Rich Media
- 📷 Image messages
- 📹 Video messages
- 🎵 Audio messages
- 📍 Location/map messages

### Interactive Elements
- ⚡ Quick replies (radio and checkbox)
- ➕ Custom actions (via action sheet)
- 🎯 Custom accessory bar with quick actions

### Custom Components
- **CustomActions**: Action button with action sheet menu
- **AccessoryBar**: Bottom toolbar with photo, camera, location, and typing buttons
- **CustomView**: Map view for location messages

## 🎮 How to Use

### Sending Messages
1. Type in the text input at the bottom
2. Press the send button to send a message

### Adding Images
1. Tap the **+** button or the **photo icon** in the accessory bar
2. Choose "Choose From Library" or "Take Picture"
3. Select or capture an image

### Sending Location
1. Tap the **location icon** in the accessory bar
2. Grant location permissions when prompted
3. Location will be sent and displayed as a map

### Loading Earlier Messages
1. Scroll to the top of the chat
2. Tap "Load earlier messages"
3. Wait for earlier messages to load (simulated with 1.5s delay)

### Quick Replies
1. Scroll to find the quick reply messages
2. Tap on any quick reply option
3. Watch it get added to your chat

### Toggle Typing Indicator
1. Tap the **chat icon** in the accessory bar
2. See the typing indicator appear/disappear

## 🎨 Customization

The example includes several customizable components that you can modify:

### Colors & Theming
The app automatically adapts to your device's color scheme (light/dark mode). You can customize the colors in the `styles` object:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light mode background
  },
  containerDark: {
    backgroundColor: '#000', // Dark mode background
  },
  // ... more styles
})
```

### Message Data
Initial messages are defined in the `initialMessages` array. You can modify or add more messages:

```typescript
const initialMessages: IMessage[] = [
  {
    _id: 1,
    text: 'Your message here',
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'Bot Name',
    },
  },
  // ... more messages
]
```

### User Configuration
The current user is defined in the `user` object:

```typescript
const user = useMemo(() => ({
  _id: 1,
  name: 'Developer',
}), [])
```

## 📱 Platform Support

This example works on:
- ✅ iOS (simulator and device)
- ✅ Android (emulator and device)
- ⚠️ Web (limited - maps and some media features may not work)

## 🔧 Troubleshooting

### Permissions Issues
If image picker or location features don't work:
1. Make sure you've granted the necessary permissions in your device settings
2. On iOS simulator, you may need to set a custom location
3. On Android emulator, enable location services

### Dependencies Not Installing
If dependencies fail to install in Expo Snack:
1. Try refreshing the page
2. Clear your browser cache
3. Try using a different browser
4. Check Expo Snack status at [status.expo.dev](https://status.expo.dev)

### Maps Not Displaying
Maps may not work on web or some simulators:
1. Use a physical device for best results
2. On Android emulator, enable Google Play Services
3. On iOS simulator, maps should work by default

## 📖 Code Structure

The `ExpoSnack.tsx` file is organized into these sections:

1. **Imports**: All required dependencies
2. **Data**: Initial messages and earlier messages
3. **Media Utilities**: Functions for image picker, camera, and location
4. **CustomView**: Component for rendering map locations
5. **CustomActions**: Action button component with action sheet
6. **AccessoryBar**: Bottom toolbar component
7. **ChatExample**: Main chat component
8. **App**: Root component with ActionSheetProvider

## 🚀 Next Steps

Once you have this working, you can:

1. Customize the styling to match your app
2. Connect to a real backend (Firebase, Socket.io, etc.)
3. Add more custom message types
4. Implement message persistence
5. Add user authentication
6. Implement push notifications

## 📚 Additional Resources

- [React Native Gifted Chat Documentation](https://github.com/FaridSafi/react-native-gifted-chat)
- [@kesha-antonov/react-native-chat](https://github.com/kesha-antonov/react-native-chat) - the maintained fork with streaming AI messages and ongoing updates
- [Expo Documentation](https://docs.expo.dev)
- [Expo Snack](https://snack.expo.dev)

## ⚠️ Known Limitations

When using in Expo Snack:
- File sizes may be limited
- Some native modules may not work
- Performance may be slower than a local app
- Network requests may be restricted

For production apps, it's recommended to use this as a starting point and develop locally with Expo CLI or React Native CLI.

## 💡 Tips

1. **Test on a real device**: Many features work better on physical devices
2. **Use the Expo Go app**: Scan the QR code with Expo Go for best results
3. **Check console for errors**: Open the console in Expo Snack to see any errors
4. **Experiment**: Modify the code and see changes in real-time!

## 📝 License

This example is based on the React Native Gifted Chat library which is MIT licensed.

---

Happy chatting! 🎉
