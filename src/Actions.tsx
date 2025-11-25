import React, { ReactNode, useCallback } from 'react'
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Text } from 'react-native-gesture-handler'
import { Color } from './Color'
import { TouchableOpacity } from './components/TouchableOpacity'

import { useChatContext } from './GiftedChatContext'
import stylesCommon from './styles'

export interface ActionsProps {
  actions?: Array<{ title: string, action: () => void }>
  actionSheetOptionTintColor?: string
  icon?: () => ReactNode
  wrapperStyle?: StyleProp<ViewStyle>
  iconTextStyle?: StyleProp<TextStyle>
  buttonStyle?: StyleProp<ViewStyle>
  onPressActionButton?(): void
}

export function Actions ({
  actions,
  actionSheetOptionTintColor = Color.optionTintColor,
  icon,
  wrapperStyle,
  iconTextStyle,
  onPressActionButton,
  buttonStyle,
}: ActionsProps) {
  const { actionSheet } = useChatContext()

  const handlePress = useCallback(() => {
    if (onPressActionButton) {
      onPressActionButton()
      return
    }

    if (!actions?.length)
      return

    const titles = actions.map(item => item.title)

    actionSheet().showActionSheetWithOptions(
      {
        options: titles,
        cancelButtonIndex: titles.length - 1,
        tintColor: actionSheetOptionTintColor,
      },
      (buttonIndex?: number) => {
        if (buttonIndex === undefined)
          return

        const item = actions[buttonIndex]
        item.action?.()
      }
    )
  }, [actionSheet, actions, actionSheetOptionTintColor, onPressActionButton])

  const renderIcon = useCallback(() => {
    if (icon)
      return icon()

    return (
      <View style={[stylesCommon.centerItems, styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>{'+'}</Text>
      </View>
    )
  }, [icon, iconTextStyle, wrapperStyle])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.button, buttonStyle]}
      >
        {renderIcon()}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  button: {
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 7,
  },

  wrapper: {
    borderColor: Color.defaultColor,
    borderWidth: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  iconText: {
    color: Color.defaultColor,
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 16,
  },
})
