import React from 'react'
import { Text, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function NavBar() {
  if (Platform.OS === 'web') {
    return null
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
      }}
    >
      <Text>💬 Gifted Chat{'\n'}</Text>
    </SafeAreaView>
  )
}
