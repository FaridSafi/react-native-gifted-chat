import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-gesture-handler'
import { Color } from './Color'

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    color: Color.alizarin,
    fontWeight: '600',
  },
})

export function MessageAudio () {
  const content = useMemo(() => (
    <View style={styles.container}>
      <Text style={styles.text}>
        {'Audio is not implemented by GiftedChat.'}
      </Text>
      <Text style={styles.text}>
        {'\nYou need to provide your own implementation by using renderMessageAudio prop.'}
      </Text>
    </View>
  ), [])

  return content
}
