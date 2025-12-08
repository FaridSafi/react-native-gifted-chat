import React, { useMemo } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle, TextStyle } from 'react-native'

import { Actions, ActionsProps } from './Actions'
import { Color } from './Color'
import { TouchableOpacityProps } from './components/TouchableOpacity'
import { Composer, ComposerProps } from './Composer'
import { useColorScheme } from './hooks/useColorScheme'
import { IMessage } from './Models'
import { Send, SendProps } from './Send'
import { getColorSchemeStyle } from './styles'
import { renderComponentOrElement } from './utils'

export interface InputToolbarProps<TMessage extends IMessage> {
  actions?: Array<{ title: string, action: () => void }>
  actionSheetOptionTintColor?: string
  containerStyle?: StyleProp<ViewStyle>
  primaryStyle?: StyleProp<ViewStyle>
  renderAccessory?: (props: InputToolbarProps<TMessage>) => React.ReactNode
  renderActions?: (props: ActionsProps) => React.ReactNode
  renderSend?: (props: SendProps<TMessage>) => React.ReactNode
  renderComposer?: (props: ComposerProps) => React.ReactNode
  onPressActionButton?: () => void
  icon?: () => React.ReactNode
  wrapperStyle?: StyleProp<ViewStyle>
  // ComposerProps
  composerHeight?: number
  text?: string
  textInputProps?: ComposerProps['textInputProps']
  // SendProps
  label?: string
  sendContainerStyle?: StyleProp<ViewStyle>
  sendTextStyle?: StyleProp<TextStyle>
  sendChildren?: React.ReactNode
  isSendButtonAlwaysVisible?: boolean
  sendButtonProps?: Partial<TouchableOpacityProps>
  onSend?(
    messages: Partial<TMessage> | Partial<TMessage>[],
    shouldResetInputToolbar: boolean,
  ): void
}

export function InputToolbar<TMessage extends IMessage = IMessage> (
  props: InputToolbarProps<TMessage>
) {
  const {
    renderActions,
    onPressActionButton,
    renderComposer,
    renderSend,
    renderAccessory,
    actions,
    actionSheetOptionTintColor,
    icon,
    wrapperStyle,
    containerStyle,
    primaryStyle,
    // ComposerProps
    composerHeight,
    text,
    textInputProps,
    // SendProps
    label,
    sendContainerStyle,
    sendTextStyle,
    sendChildren,
    isSendButtonAlwaysVisible,
    sendButtonProps,
    onSend,
  } = props

  const colorScheme = useColorScheme()

  const actionsFragment = useMemo(() => {
    const actionsProps = {
      onPressActionButton,
      actions,
      actionSheetOptionTintColor,
      icon,
      wrapperStyle,
      containerStyle,
    }

    if (renderActions)
      return renderComponentOrElement(renderActions, actionsProps)

    if (onPressActionButton)
      return <Actions {...actionsProps} />

    return null
  }, [
    renderActions,
    onPressActionButton,
    actions,
    actionSheetOptionTintColor,
    icon,
    wrapperStyle,
    containerStyle,
  ])

  const composerFragment = useMemo(() => {
    const composerProps: ComposerProps = { composerHeight, text, textInputProps }

    if (renderComposer)
      return renderComponentOrElement(renderComposer, composerProps)

    return <Composer {...composerProps} />
  }, [renderComposer, composerHeight, text, textInputProps])

  const sendFragment = useMemo(() => {
    const sendProps: SendProps<TMessage> = {
      text,
      label,
      containerStyle: sendContainerStyle,
      textStyle: sendTextStyle,
      children: sendChildren,
      isSendButtonAlwaysVisible,
      sendButtonProps,
      onSend,
    }

    if (renderSend)
      return renderComponentOrElement(renderSend, sendProps)

    return <Send {...sendProps} />
  }, [renderSend, text, label, sendContainerStyle, sendTextStyle, sendChildren, isSendButtonAlwaysVisible, sendButtonProps, onSend])

  const accessoryFragment = useMemo(() => {
    if (!renderAccessory)
      return null

    return renderComponentOrElement(renderAccessory, props)
  }, [renderAccessory, props])

  return (
    <View
      style={[getColorSchemeStyle(styles, 'container', colorScheme), containerStyle]}
    >
      <View style={[getColorSchemeStyle(styles, 'primary', colorScheme), primaryStyle]}>
        {actionsFragment}
        {composerFragment}
        {sendFragment}
      </View>
      {accessoryFragment}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
  },
  container_dark: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#444',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
})
