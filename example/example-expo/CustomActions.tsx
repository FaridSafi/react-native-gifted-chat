import React, { useCallback } from 'react'
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { RectButton } from 'react-native-gesture-handler'
import { IMessage, User } from '../../src'
import {
  getLocationAsync,
  pickImageAsync,
  takePictureAsync,
} from './mediaUtils'

interface Props {
  renderIcon?: () => React.ReactNode
  wrapperStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  iconTextStyle?: StyleProp<TextStyle>
  onSend: (messages: IMessage[]) => void
  user: User
}

const CustomActions = ({
  renderIcon,
  iconTextStyle,
  containerStyle,
  wrapperStyle,
  onSend,
  user,
}: Props) => {
  const { showActionSheetWithOptions } = useActionSheet()
  const colorScheme = useColorScheme()

  const handlePickImage = useCallback(async () => {
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
  }, [onSend, user])

  const handleTakePicture = useCallback(async () => {
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
  }, [onSend, user])

  const handleSendLocation = useCallback(async () => {
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
  }, [onSend, user])

  const onActionsPress = useCallback(() => {
    const options: { title: string, action?: () => Promise<void> }[] = [
      { title: 'Choose From Library', action: handlePickImage },
      { title: 'Take Picture', action: handleTakePicture },
      { title: 'Send Location', action: handleSendLocation },
      { title: 'Cancel' },
    ]
    const cancelButtonIndex = options.length - 1

    showActionSheetWithOptions(
      {
        options: options.map(o => o.title),
        cancelButtonIndex,
      },
      async buttonIndex => {
        if (buttonIndex !== undefined) {
          const selectedOption = options[buttonIndex]
          selectedOption?.action?.()
        }
      }
    )
  }, [showActionSheetWithOptions, handlePickImage, handleTakePicture, handleSendLocation])

  const renderIconComponent = useCallback(() => {
    if (renderIcon)
      return renderIcon()

    const wrapperColorStyle = colorScheme === 'dark' ? styles.wrapper_dark : {}
    const iconTextColorStyle = colorScheme === 'dark' ? styles.iconText_dark : {}

    return (
      <View style={[styles.wrapper, wrapperColorStyle, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextColorStyle, iconTextStyle]}>+</Text>
      </View>
    )
  }, [renderIcon, wrapperStyle, iconTextStyle, colorScheme])

  return (
    <RectButton
      style={[styles.container, containerStyle]}
      onPress={onActionsPress}
    >
      {renderIconComponent()}
    </RectButton>
  )
}

export default CustomActions

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  wrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper_dark: {
    borderColor: '#666',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  iconText_dark: {
    color: '#999',
  },
})
