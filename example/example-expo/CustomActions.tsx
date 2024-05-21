import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useActionSheet } from '@expo/react-native-action-sheet'
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
  onSend: (messages: any) => void
}

const CustomActions = ({
  renderIcon,
  iconTextStyle,
  containerStyle,
  wrapperStyle,
  onSend,
}: Props) => {
  const { showActionSheetWithOptions } = useActionSheet()

  const onActionsPress = useCallback(() => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ]
    const cancelButtonIndex = options.length - 1

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            pickImageAsync(onSend)
            return
          case 1:
            takePictureAsync(onSend)
            return
          case 2:
            getLocationAsync(onSend)
            return
        }
      },
    )
  }, [showActionSheetWithOptions])

  const renderIconComponent = useCallback(() => {
    if (renderIcon)
      return renderIcon()

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    )
  }, [renderIcon])

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
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
}
