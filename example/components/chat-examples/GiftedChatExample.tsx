import React from 'react'
import { StyleSheet, View } from 'react-native'
import Chats from '../../example-gifted-chat/src/Chats'

export default function GiftedChatExample () {
  return (
    <View style={styles.container}>
      <Chats />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
