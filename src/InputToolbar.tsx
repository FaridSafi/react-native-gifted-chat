import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle, TextStyle } from 'react-native'

import { Actions, ActionsProps } from './Actions'
import { Color } from './Color'
import { Composer, ComposerProps } from './Composer'
import { useColorScheme } from './hooks/useColorScheme'
import { IMessage, ReplyMessage } from './Models'
import { ReplyPreview, ReplyPreviewProps } from './ReplyPreview'
import { Send, SendProps } from './Send'
import { renderComponentOrElement } from './utils'

export { ReplyPreviewProps } from './ReplyPreview'

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
  /** Reply message to show in preview */
  replyMessage?: ReplyMessage | null
  /** Callback to clear reply */
  onClearReply?: () => void
  /** Custom render for reply preview */
  renderReplyPreview?: (props: ReplyPreviewProps) => React.ReactNode
  /** Style for reply preview container */
  replyPreviewContainerStyle?: StyleProp<ViewStyle>
  /** Style for reply preview username */
  replyPreviewUsernameStyle?: StyleProp<TextStyle>
  /** Style for reply preview text */
  replyPreviewTextStyle?: StyleProp<TextStyle>
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
    replyMessage,
    onClearReply,
    renderReplyPreview: renderReplyPreviewProp,
    replyPreviewContainerStyle,
    replyPreviewUsernameStyle,
    replyPreviewTextStyle,
  } = props

  const colorScheme = useColorScheme()

  const containerStyles = useMemo(() => [
    styles.container,
    colorScheme === 'dark' && styles.container_dark,
    containerStyle,
  ], [colorScheme, containerStyle])

  const primaryStyles = useMemo(() => [
    styles.primary,
    props.primaryStyle,
  ], [props.primaryStyle])

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
    const composerProps = props as ComposerProps

    if (renderComposer)
      return renderComponentOrElement(renderComposer, composerProps)

    return <Composer {...composerProps} />
  }, [renderComposer, props])

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

  const handleClearReply = useCallback(() => {
    onClearReply?.()
  }, [onClearReply])

  const replyPreviewFragment = useMemo(() => {
    if (!replyMessage)
      return null

    const replyPreviewProps: ReplyPreviewProps = {
      replyMessage,
      onClearReply: handleClearReply,
      containerStyle: replyPreviewContainerStyle,
      usernameStyle: replyPreviewUsernameStyle,
      textStyle: replyPreviewTextStyle,
    }

    if (renderReplyPreviewProp)
      return renderComponentOrElement(renderReplyPreviewProp, replyPreviewProps)

    return <ReplyPreview {...replyPreviewProps} />
  }, [
    replyMessage,
    handleClearReply,
    renderReplyPreviewProp,
    replyPreviewContainerStyle,
    replyPreviewUsernameStyle,
    replyPreviewTextStyle,
  ])

  return (
    <View style={containerStyles}>
      {replyPreviewFragment}
      <View style={primaryStyles}>
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
