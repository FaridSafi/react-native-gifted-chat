import React, { useMemo } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle, useColorScheme } from 'react-native'

import { Actions, ActionsProps } from './Actions'
import Color from './Color'
import { Composer, ComposerProps } from './Composer'
import { Send, SendProps } from './Send'
import { IMessage } from './types'

export interface InputToolbarProps<TMessage extends IMessage> {
  actions?: Array<{ title: string, action: () => void }>
  actionSheetOptionTintColor?: string
  containerStyle?: StyleProp<ViewStyle>
  primaryStyle?: StyleProp<ViewStyle>
  accessoryStyle?: StyleProp<ViewStyle>
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode
  renderActions?(props: ActionsProps): React.ReactNode
  renderSend?(props: SendProps<TMessage>): React.ReactNode
  renderComposer?(props: ComposerProps): React.ReactNode
  onPressActionButton?(): void
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
    const props = {
      onPressActionButton,
      actions,
      actionSheetOptionTintColor,
      icon,
      wrapperStyle,
      containerStyle,
    }

    return (
      renderActions?.(props) || (onPressActionButton && <Actions {...props} />)
    )
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
    return (
      renderComposer?.(props as ComposerProps) || (
        <Composer {...(props as ComposerProps)} />
      )
    )
  }, [renderComposer, props])

  const sendFragment = useMemo(() => {
    return renderSend?.(props) || <Send {...props} />
  }, [renderSend, props])

  const accessoryFragment = useMemo(() => {
    if (!renderAccessory)
      return null

    return (
      <View style={[styles.accessory, props.accessoryStyle]}>
        {renderAccessory(props)}
      </View>
    )
  }, [renderAccessory, props])

  return (
    <View style={[styles.container, styles[`container_${colorScheme}`], containerStyle]}>
      <View style={[styles.primary, props.primaryStyle]}>
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
  accessory: {
    height: 44,
  },
})
