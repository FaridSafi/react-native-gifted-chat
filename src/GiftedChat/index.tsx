import React, {
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  RefObject,
} from 'react'
import {
  Platform,
  View,
  LayoutChangeEvent,
  useColorScheme,
} from 'react-native'
import {
  ActionSheetProvider,
  ActionSheetProviderRef,
} from '@expo/react-native-action-sheet'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TEST_ID } from '../Constant'
import { GiftedChatContext } from '../GiftedChatContext'
import { InputToolbar } from '../InputToolbar'
import { MessagesContainer, AnimatedList } from '../MessagesContainer'
import { IMessage, ReplyMessage } from '../Models'
import stylesCommon from '../styles'
import { renderComponentOrElement } from '../utils'
import styles from './styles'
import { GiftedChatProps } from './types'

dayjs.extend(localizedFormat)

/**
 * Default keyboard vertical offset values (similar to Stream Chat SDK)
 * iOS: Compensates for predictive/suggestion text bar (~44-50pt) and headers
 * Android: Negative offset to account for navigation bar in edge-to-edge mode
 */
const DEFAULT_KEYBOARD_VERTICAL_OFFSET = Platform.select({
  ios: 50,
  android: 0,
  default: 0,
})

const DEFAULT_KEYBOARD_BEHAVIOR = Platform.select({
  ios: 'padding' as const,
  android: 'padding' as const,
  default: 'padding' as const,
})

function GiftedChat<TMessage extends IMessage = IMessage> (
  props: GiftedChatProps<TMessage>
) {
  const {
    messages = [],
    initialText = '',
    isTyping,

    // "random" function from here: https://stackoverflow.com/a/8084248/3452513
    // we do not use uuid since it would add extra native dependency (https://www.npmjs.com/package/react-native-get-random-values)
    // lib's user can decide which algorithm to use and pass it as a prop
    messageIdGenerator = () => (Math.random() + 1).toString(36).substring(7),

    user = {},
    onSend,
    locale = 'en',
    colorScheme: colorSchemeProp,
    renderLoading,
    actionSheet,
    textInputProps,
    renderChatFooter,
    renderInputToolbar,
    isInverted = true,

    // Reply props
    isSwipeToReplyEnabled = false,
    swipeToReplyDirection = 'right',
    onSwipeToReply,
    renderSwipeToReplyAction,
    swipeToReplyActionContainerStyle,
    replyMessage: replyMessageProp,
    onClearReply,
    renderReplyPreview,
    replyPreviewContainerStyle,
    replyPreviewTextStyle,
    renderMessageReply,
    onPressMessageReply,
    messageReplyContainerStyle,
    messageReplyContainerStyleLeft,
    messageReplyContainerStyleRight,
    messageReplyTextStyle,
    messageReplyTextStyleLeft,
    messageReplyTextStyleRight,
    messageReplyImageStyle,
  } = props

  const systemColorScheme = useColorScheme()
  const colorScheme = colorSchemeProp !== undefined ? colorSchemeProp : systemColorScheme

  const actionSheetRef = useRef<ActionSheetProviderRef>(null)

  const messagesContainerRef = useMemo(
    () => props.messagesContainerRef || createRef<AnimatedList<TMessage>>(),
    [props.messagesContainerRef]
  ) as RefObject<AnimatedList<TMessage>>

  const textInputRef = useMemo(
    () => props.textInputRef || createRef<TextInput>(),
    [props.textInputRef]
  )

  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [text, setText] = useState<string | undefined>(() => props.text || '')
  const [internalReplyMessage, setInternalReplyMessage] = useState<ReplyMessage | null>(null)

  // Use controlled or uncontrolled reply state
  const replyMessage = replyMessageProp !== undefined ? replyMessageProp : internalReplyMessage

  const getTextFromProp = useCallback(
    (fallback: string) => {
      if (props.text === undefined)
        return fallback

      return props.text
    },
    [props.text]
  )

  const scrollToBottom = useCallback(
    (isAnimated = true) => {
      if (!messagesContainerRef?.current)
        return

      if (isInverted) {
        messagesContainerRef.current.scrollToOffset({
          offset: 0,
          animated: isAnimated,
        })
        return
      }

      messagesContainerRef.current.scrollToEnd({ animated: isAnimated })
    },
    [isInverted, messagesContainerRef]
  )

  const handleSwipeToReply = useCallback(
    (message: TMessage) => {
      if (replyMessageProp === undefined)
        // Uncontrolled mode: manage state internally
        setInternalReplyMessage({
          _id: message._id,
          text: message.text,
          user: message.user,
          image: message.image,
          audio: message.audio,
        })

      onSwipeToReply?.(message)
    },
    [replyMessageProp, onSwipeToReply]
  )

  const clearReply = useCallback(() => {
    if (replyMessageProp === undefined)
      // Uncontrolled mode: manage state internally
      setInternalReplyMessage(null)

    onClearReply?.()
  }, [replyMessageProp, onClearReply])

  const renderMessages = useMemo(() => {
    if (!isInitialized)
      return null

    const { messagesContainerStyle, ...messagesContainerProps } = props

    return (
      <View style={[stylesCommon.fill, messagesContainerStyle]}>
        <MessagesContainer<TMessage>
          {...messagesContainerProps}
          isInverted={isInverted}
          messages={messages}
          forwardRef={messagesContainerRef}
          isTyping={isTyping}
          // Swipe to reply props
          isSwipeToReplyEnabled={isSwipeToReplyEnabled}
          swipeToReplyDirection={swipeToReplyDirection}
          onSwipeToReply={handleSwipeToReply}
          renderSwipeToReplyAction={renderSwipeToReplyAction}
          swipeToReplyActionContainerStyle={swipeToReplyActionContainerStyle}
          // Message reply props
          renderMessageReply={renderMessageReply}
          onPressMessageReply={onPressMessageReply}
          messageReplyContainerStyle={messageReplyContainerStyle}
          messageReplyContainerStyleLeft={messageReplyContainerStyleLeft}
          messageReplyContainerStyleRight={messageReplyContainerStyleRight}
          messageReplyTextStyle={messageReplyTextStyle}
          messageReplyTextStyleLeft={messageReplyTextStyleLeft}
          messageReplyTextStyleRight={messageReplyTextStyleRight}
          messageReplyImageStyle={messageReplyImageStyle}
        />
        {renderComponentOrElement(renderChatFooter, {})}
      </View>
    )
  }, [
    isInitialized,
    isTyping,
    messages,
    props,
    isInverted,
    messagesContainerRef,
    renderChatFooter,
    isSwipeToReplyEnabled,
    swipeToReplyDirection,
    handleSwipeToReply,
    renderSwipeToReplyAction,
    swipeToReplyActionContainerStyle,
    renderMessageReply,
    onPressMessageReply,
    messageReplyContainerStyle,
    messageReplyContainerStyleLeft,
    messageReplyContainerStyleRight,
    messageReplyTextStyle,
    messageReplyTextStyleLeft,
    messageReplyTextStyleRight,
    messageReplyImageStyle,
  ])

  const notifyInputTextReset = useCallback(() => {
    props.textInputProps?.onChangeText?.('')
  }, [props.textInputProps])

  const resetInputToolbar = useCallback(() => {
    textInputRef.current?.clear()

    notifyInputTextReset()

    setText(getTextFromProp(''))
  }, [
    getTextFromProp,
    textInputRef,
    notifyInputTextReset,
  ])

  const _onSend = useCallback(
    (messages: TMessage[] = [], shouldResetInputToolbar = false) => {
      if (!Array.isArray(messages))
        messages = [messages]

      const newMessages: TMessage[] = messages.map(message => {
        return {
          ...message,
          user: user!,
          createdAt: new Date(),
          _id: messageIdGenerator?.(),
          // Attach reply message if exists
          ...(replyMessage ? { replyMessage } : {}),
        }
      })

      if (shouldResetInputToolbar === true)
        resetInputToolbar()

      // Clear reply after sending
      clearReply()

      onSend?.(newMessages)

      setTimeout(() => scrollToBottom(), 10)
    },
    [messageIdGenerator, onSend, user, resetInputToolbar, scrollToBottom, replyMessage, clearReply]
  )

  const _onChangeText = useCallback(
    (text: string) => {
      props.textInputProps?.onChangeText?.(text)

      // Only set state if it's not being overridden by a prop.
      if (props.text === undefined)
        setText(text)
    },
    [props.text, props.textInputProps]
  )

  const onInitialLayoutViewLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (isInitialized)
        return

      const { layout } = e.nativeEvent

      if (layout.height <= 0)
        return

      notifyInputTextReset()

      setIsInitialized(true)
      setText(getTextFromProp(initialText))
    },
    [isInitialized, initialText, notifyInputTextReset, getTextFromProp]
  )

  const inputToolbarFragment = useMemo(() => {
    if (!isInitialized)
      return null

    const inputToolbarProps = {
      ...props,
      text: getTextFromProp(text!),
      onSend: _onSend,
      textInputProps: {
        ...textInputProps,
        onChangeText: _onChangeText,
        ref: textInputRef,
      },
      // Reply preview props
      replyMessage,
      onClearReply: clearReply,
      renderReplyPreview,
      replyPreviewContainerStyle,
      replyPreviewTextStyle,
    }

    if (renderInputToolbar)
      return renderComponentOrElement(renderInputToolbar, inputToolbarProps)

    return <InputToolbar {...inputToolbarProps} />
  }, [
    isInitialized,
    _onSend,
    getTextFromProp,
    props,
    text,
    renderInputToolbar,
    textInputRef,
    textInputProps,
    _onChangeText,
    replyMessage,
    clearReply,
    renderReplyPreview,
    replyPreviewContainerStyle,
    replyPreviewTextStyle,
  ])

  const contextValues = useMemo(
    () => ({
      actionSheet:
        actionSheet ||
        (() => ({
          showActionSheetWithOptions:
            actionSheetRef.current!.showActionSheetWithOptions,
        })),
      getLocale: () => locale,
      getColorScheme: () => colorScheme,
    }),
    [actionSheet, locale, colorScheme]
  )

  useEffect(() => {
    if (props.text != null)
      setText(props.text)
  }, [props.text])

  return (
    <GiftedChatContext.Provider value={contextValues}>
      <ActionSheetProvider ref={actionSheetRef}>
        <View
          testID={TEST_ID.WRAPPER}
          style={[stylesCommon.fill, styles.contentContainer]}
          onLayout={onInitialLayoutViewLayout}
        >
          {/* @ts-expect-error */}
          <KeyboardAvoidingView
            behavior={DEFAULT_KEYBOARD_BEHAVIOR}
            keyboardVerticalOffset={DEFAULT_KEYBOARD_VERTICAL_OFFSET}
            style={stylesCommon.fill}
            {...props.keyboardAvoidingViewProps}
          >
            <View style={stylesCommon.fill}>
              {isInitialized
                ? (
                  <>
                    {renderMessages}
                    {inputToolbarFragment}
                  </>
                )
                : (
                  renderComponentOrElement(renderLoading, {})
                )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </ActionSheetProvider>
    </GiftedChatContext.Provider>
  )
}

function GiftedChatWrapper<TMessage extends IMessage = IMessage> (props: GiftedChatProps<TMessage>) {
  const {
    keyboardProviderProps,
    ...rest
  } = props

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <KeyboardProvider
          statusBarTranslucent
          navigationBarTranslucent
          {...keyboardProviderProps}
        >
          <GiftedChat<TMessage> {...rest} />
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

GiftedChatWrapper.append = <TMessage extends IMessage>(
  currentMessages: TMessage[] = [],
  messages: TMessage[],
  isInverted = true
) => {
  if (!Array.isArray(messages))
    messages = [messages]

  return isInverted
    ? messages.concat(currentMessages)
    : currentMessages.concat(messages)
}

GiftedChatWrapper.prepend = <TMessage extends IMessage>(
  currentMessages: TMessage[] = [],
  messages: TMessage[],
  isInverted = true
) => {
  if (!Array.isArray(messages))
    messages = [messages]

  return isInverted
    ? currentMessages.concat(messages)
    : messages.concat(currentMessages)
}

export {
  GiftedChatWrapper as GiftedChat
}
