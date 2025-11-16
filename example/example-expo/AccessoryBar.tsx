import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native'

import {
  getLocationAsync,
  pickImageAsync,
  takePictureAsync,
} from './mediaUtils'

export default function AccessoryBar ({ onSend, isTyping }: any) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View style={[styles.container, styles[`container_${colorScheme}`]]}>
      <Button
        onPress={() => pickImageAsync(onSend)}
        name='photo'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
      <Button
        onPress={() => takePictureAsync(onSend)}
        name='camera'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
      <Button
        onPress={() => getLocationAsync(onSend)}
        name='my-location'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
      <Button
        onPress={() => {
          isTyping()
        }}
        name='chat'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
    </View>
  )
}

const Button = ({
  onPress,
  size = 30,
  color = 'rgba(0,0,0,0.5)',
  ...props
}) => (
  <TouchableOpacity onPress={onPress}>
    <MaterialIcons size={size} color={color} {...props} />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
  container_dark: {
    backgroundColor: '#1a1a1a',
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
})
