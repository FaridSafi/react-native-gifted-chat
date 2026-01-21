import { Stack, useRouter } from 'expo-router'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

export default function ChatLayout () {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: { paddingBottom: insets.bottom, backgroundColor: '#fff' },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name='chevron-back' size={24} color='#007AFF' />
            <Text style={styles.backText}>Back</Text>
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
    </Stack>
  )
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  backText: {
    color: '#007AFF',
    fontSize: 17,
  },
})
