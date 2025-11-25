import React, { useMemo } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle, useColorScheme } from 'react-native'

import { Actions, ActionsProps } from './Actions'
import { Color } from './Color'
import { Composer, ComposerProps } from './Composer'
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
    let composerProps = props as ComposerProps

    if (!actionsFragment)
      composerProps = {
        ...composerProps,
        textInputProps: {
          style: [styles.textInputWithPadding, composerProps.textInputProps?.style],
        },
      }

    if (renderComposer)
      return renderComponentOrElement(renderComposer, composerProps)

    return <Composer {...composerProps} />
  }, [renderComposer, props, actionsFragment])

  const sendFragment = useMemo(() => {
    if (renderSend)
      return renderComponentOrElement(renderSend, props)

    return <Send {...props} />
  }, [renderSend, props])

  const accessoryFragment = useMemo(() => {
    if (!renderAccessory)
      return null

    return renderComponentOrElement(renderAccessory, props)
  }, [renderAccessory, props])

  return (
    <View
      style={[getColorSchemeStyle(styles, 'container', colorScheme), containerStyle]}
    >
      <View style={[getColorSchemeStyle(styles, 'primary', colorScheme), props.primaryStyle]}>
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

  textInputWithPadding: {
    paddingLeft: 10,
  },
})
