import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Color } from './Color'

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    color: Color.alizarin,
    fontWeight: '600',
  },
})

export function MessageVideo () {
  const content = useMemo(() => (
    <View style={styles.container}>
      <Text style={styles.text}>
        {'Video is not implemented by GiftedChat.'}
      </Text>
      <Text style={styles.text}>
        {'\nYou need to provide your own implementation by using renderMessageVideo prop.'}
      </Text>
    </View>
  ), [])

  return content
}
