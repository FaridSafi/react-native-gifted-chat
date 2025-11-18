import React from 'react'
import { StyleSheet, View, useColorScheme } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'

import { IMessage, User } from '../../src'
import {
  getLocationAsync,
  pickImageAsync,
  takePictureAsync,
} from './mediaUtils'

export default function AccessoryBar ({ onSend, isTyping, user }: { onSend: (messages: IMessage[]) => void, isTyping: () => void, user: User }) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const handlePickImage = async () => {
    const images = await pickImageAsync()
    if (!images)
      return

    const messages: IMessage[] = images.map(image => ({
      _id: Math.random().toString(36).substring(7),
      image,
      text: '',
      createdAt: new Date(),
      user,
    }))
    onSend(messages)
  }

  const handleTakePicture = async () => {
    const images = await takePictureAsync()
    if (!images)
      return

    const messages: IMessage[] = images.map(image => ({
      _id: Math.random().toString(36).substring(7),
      image,
      text: '',
      createdAt: new Date(),
      user,
    }))
    onSend(messages)
  }

  const handleSendLocation = async () => {
    const location = await getLocationAsync()
    if (!location)
      return

    const message: IMessage = {
      _id: Math.random().toString(36).substring(7),
      location,
      text: '',
      createdAt: new Date(),
      user,
    }
    onSend([message])
  }

  const containerColorStyle = colorScheme === 'dark' ? styles.container_dark : {}

  return (
    <View style={[styles.container, containerColorStyle]}>
      <Button
        onPress={handlePickImage}
        name='photo'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
      <Button
        onPress={handleTakePicture}
        name='camera'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
      <Button
        onPress={handleSendLocation}
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
  name,
}: {
  onPress: () => void
  size?: number
  color?: string
  name: React.ComponentProps<typeof MaterialIcons>['name']
}) => (
  <RectButton onPress={onPress}>
    <MaterialIcons size={size} color={color} name={name} />
  </RectButton>
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
