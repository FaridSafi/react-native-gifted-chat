import React, { ReactNode, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
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
  containerStyle?: StyleProp<ViewStyle>
  onPressActionButton?(): void
}

export function Actions ({
  actions,
  actionSheetOptionTintColor = Color.optionTintColor,
  icon,
  wrapperStyle,
  iconTextStyle,
  onPressActionButton,
  containerStyle,
}: ActionsProps) {
  const { actionSheet } = useChatContext()

  const onActionsPress = useCallback(() => {
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
  }, [actionSheet, actions, actionSheetOptionTintColor])

  const renderIcon = useCallback(() => {
    if (icon)
      return icon()

    return (
      <View style={[stylesCommon.fill, stylesCommon.centerItems, styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>{'+'}</Text>
      </View>
    )
  }, [icon, iconTextStyle, wrapperStyle])

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPressActionButton || onActionsPress}
    >
      {renderIcon()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: Color.defaultColor,
    borderWidth: 2,
  },
  iconText: {
    color: Color.defaultColor,
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 16,
    backgroundColor: Color.backgroundTransparent,
    textAlign: 'center',
  },
})
