import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { LogBox } from 'react-native'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'

LogBox.ignoreLogs(['Open debugger to view warnings'])

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout () {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='modal' options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  )
}
