import React from 'react'
import { StyleSheet, View, useColorScheme } from 'react-native'
import Chats from '../../example-gifted-chat/src/Chats'

export default function GiftedChatExample () {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Chats />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
})
