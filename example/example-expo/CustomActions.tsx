import React, { useCallback } from 'react'
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'

import { useActionSheet } from '@expo/react-native-action-sheet'
import {
  getLocationAsync,
  pickImageAsync,
  takePictureAsync,
} from './mediaUtils'
import { LocationObjectCoords } from 'expo-location'

interface Props {
  renderIcon?: () => React.ReactNode
  wrapperStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  iconTextStyle?: StyleProp<TextStyle>
  onSend: (messages: { location?: LocationObjectCoords, image?: string }[]) => void
}

const CustomActions = ({
  renderIcon,
  iconTextStyle,
  containerStyle,
  wrapperStyle,
  onSend,
}: Props) => {
  const { showActionSheetWithOptions } = useActionSheet()
  const colorScheme = useColorScheme()

  const onActionsPress = useCallback(() => {
    const options: { title: string; action?: () => Promise<void> }[] = [
      { title: 'Choose From Library', action: () => pickImageAsync(onSend) },
      { title: 'Take Picture', action: () => takePictureAsync(onSend) },
      { title: 'Send Location', action: () => getLocationAsync(onSend) },
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
  }, [showActionSheetWithOptions, onSend])

  const renderIconComponent = useCallback(() => {
    if (renderIcon)
      return renderIcon()

    return (
      <View style={[styles.wrapper, styles[`wrapper_${colorScheme}`], wrapperStyle]}>
        <Text style={[styles.iconText, styles[`iconText_${colorScheme}`], iconTextStyle]}>+</Text>
      </View>
    )
  }, [renderIcon, wrapperStyle, iconTextStyle, colorScheme])

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onActionsPress}
    >
      {renderIconComponent()}
    </TouchableOpacity>
  )
}

export default CustomActions

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
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
