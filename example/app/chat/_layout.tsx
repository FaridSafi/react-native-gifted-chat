import { TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ChatLayout () {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        // Expo Router 58 defaults to a transparent Liquid Glass header that the
        // screen scrolls under. iOS 26+ then blurs scroll content beneath it with a
        // scroll edge effect, and on an inverted chat list that blur covers the
        // whole list. An opaque header keeps the list below it.
        headerTransparent: false,
        // Even under an opaque header iOS still attaches its scroll edge effects to the
        // list, and the inverted list flips them, blurring the messages.
        scrollEdgeEffects: { top: 'hidden', bottom: 'hidden', left: 'hidden', right: 'hidden' },
        contentStyle: { paddingBottom: insets.bottom, backgroundColor: '#fff' },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name='chevron-back' size={24} color='#007AFF' />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name='basic'
        options={{ title: 'Basic Example' }}
      />
      <Stack.Screen
        name='customized-rendering'
        options={{ title: 'Customized Rendering' }}
      />
      <Stack.Screen
        name='links'
        options={{ title: 'Links & Patterns' }}
      />
      <Stack.Screen
        name='reply'
        options={{ title: 'Reply Example' }}
      />
      <Stack.Screen
        name='slack'
        options={{ title: 'Slack Style' }}
      />
      <Stack.Screen
        name='day-animated'
        options={{ title: 'Day Animated' }}
      />
      <Stack.Screen
        name='reactions'
        options={{ title: 'Reactions' }}
      />
      <Stack.Screen
        name='aligned-top'
        options={{ title: 'Top Aligned (short chat)' }}
      />
    </Stack>
  )
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
})
