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
  TextInput,
  View,
  LayoutChangeEvent,
} from 'react-native'
import {
  ActionSheetProvider,
  ActionSheetProviderRef,
} from '@expo/react-native-action-sheet'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { MAX_COMPOSER_HEIGHT, MIN_COMPOSER_HEIGHT, TEST_ID } from '../Constant'
import { GiftedChatContext } from '../GiftedChatContext'
import { InputToolbar } from '../InputToolbar'
import { MessageContainer, AnimatedList } from '../MessageContainer'
import { IMessage } from '../Models'
import stylesCommon from '../styles'
import { renderComponentOrElement } from '../utils'
import styles from './styles'
import { GiftedChatProps } from './types'

dayjs.extend(localizedFormat)

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
    renderLoading,
    actionSheet,
    textInputProps,
    renderChatFooter,
    renderInputToolbar,
    keyboardBottomOffset = 0,
    focusOnInputWhenOpeningKeyboard = true,
    inverted = true,
    minComposerHeight = MIN_COMPOSER_HEIGHT,
    maxComposerHeight = MAX_COMPOSER_HEIGHT,
    isKeyboardInternallyHandled = true,
  } = props

  const actionSheetRef = useRef<ActionSheetProviderRef>(null)

  const messageContainerRef = useMemo(
    () => props.messageContainerRef || createRef<AnimatedList<TMessage>>(),
    [props.messageContainerRef]
  ) as RefObject<AnimatedList<TMessage>>

  const textInputRef = useMemo(
    () => props.textInputRef || createRef<TextInput>(),
    [props.textInputRef]
  )

  const isTextInputWasFocused: RefObject<boolean> = useRef(false)

  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [composerHeight, setComposerHeight] = useState<number>(
    minComposerHeight!
  )
  const [text, setText] = useState<string | undefined>(() => props.text || '')

  // Always call the hook, but conditionally use its data
  const keyboardControllerData = useReanimatedKeyboardAnimation()

  // Create a mock keyboard object when keyboard is not internally handled
  const keyboard = useMemo(() => {
    if (!isKeyboardInternallyHandled)
      return { height: { value: 0 } }

    return keyboardControllerData
  }, [isKeyboardInternallyHandled, keyboardControllerData])

  const trackingKeyboardMovement = useSharedValue(false)
  const keyboardBottomOffsetAnim = useSharedValue(0)

  const contentStyleAnim = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: keyboard.height.value + keyboardBottomOffsetAnim.value },
      ],
    }),
    [keyboard, keyboardBottomOffsetAnim]
  )

  const getTextFromProp = useCallback(
    (fallback: string) => {
      if (props.text === undefined)
        return fallback

      return props.text
    },
    [props.text]
  )

  /**
   * Store text input focus status when keyboard hide to retrieve
   * it afterwards if needed.
   * `onKeyboardWillHide` may be called twice in sequence so we
   * make a guard condition (eg. showing image picker)
   */
  const handleTextInputFocusWhenKeyboardHide = useCallback(() => {
    if (!isTextInputWasFocused.current)
      isTextInputWasFocused.current =
        textInputRef.current?.isFocused() || false
  }, [textInputRef])

  /**
   * Refocus the text input only if it was focused before showing keyboard.
   * This is needed in some cases (eg. showing image picker).
   */
  const handleTextInputFocusWhenKeyboardShow = useCallback(() => {
    if (
      textInputRef.current &&
      isTextInputWasFocused.current &&
      !textInputRef.current.isFocused()
    )
      textInputRef.current.focus()

    // Reset the indicator since the keyboard is shown
    isTextInputWasFocused.current = false
  }, [textInputRef])

  const scrollToBottom = useCallback(
    (isAnimated = true) => {
      if (!messageContainerRef?.current)
        return

      if (inverted) {
        messageContainerRef.current.scrollToOffset({
          offset: 0,
          animated: isAnimated,
        })
        return
      }

      messageContainerRef.current.scrollToEnd({ animated: isAnimated })
    },
    [inverted, messageContainerRef]
  )

  const renderMessages = useMemo(() => {
    if (!isInitialized)
      return null

    const { messagesContainerStyle, ...messagesContainerProps } = props

    return (
      <View style={[stylesCommon.fill, messagesContainerStyle]}>
        <MessageContainer<TMessage>
          {...messagesContainerProps}
          inverted={inverted}
          messages={messages}
          forwardRef={messageContainerRef}
          isTyping={isTyping}
        />
        {renderComponentOrElement(renderChatFooter, {})}
      </View>
    )
  }, [
    isInitialized,
    isTyping,
    messages,
    props,
    inverted,
    messageContainerRef,
    renderChatFooter,
  ])

  const notifyInputTextReset = useCallback(() => {
    props.textInputProps?.onChangeText?.('')
  }, [props.textInputProps])

  const resetInputToolbar = useCallback(() => {
    textInputRef.current?.clear()

    notifyInputTextReset()

    setComposerHeight(minComposerHeight!)
    setText(getTextFromProp(''))
  }, [
    minComposerHeight,
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
        }
      })

      if (shouldResetInputToolbar === true)
        resetInputToolbar()

      onSend?.(newMessages)

      setTimeout(() => scrollToBottom(), 10)
    },
    [messageIdGenerator, onSend, user, resetInputToolbar, scrollToBottom]
  )

  const onInputSizeChanged = useCallback(
    (size: { height: number }) => {
      const newComposerHeight = Math.max(
        minComposerHeight!,
        Math.min(maxComposerHeight!, size.height)
      )

      setComposerHeight(newComposerHeight)
    },
    [maxComposerHeight, minComposerHeight]
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
      setComposerHeight(minComposerHeight!)
      setText(getTextFromProp(initialText))
    },
    [isInitialized, initialText, minComposerHeight, notifyInputTextReset, getTextFromProp]
  )

  const inputToolbarFragment = useMemo(() => {
    if (!isInitialized)
      return null

    const inputToolbarProps = {
      ...props,
      text: getTextFromProp(text!),
      composerHeight: Math.max(minComposerHeight!, composerHeight),
      onSend: _onSend,
      onInputSizeChanged,
      textInputProps: {
        ...textInputProps,
        onChangeText: _onChangeText,
        ref: textInputRef,
      },
    }

    if (renderInputToolbar)
      return renderComponentOrElement(renderInputToolbar, inputToolbarProps)

    return <InputToolbar {...inputToolbarProps} />
  }, [
    isInitialized,
    _onSend,
    getTextFromProp,
    minComposerHeight,
    onInputSizeChanged,
    props,
    text,
    renderInputToolbar,
    composerHeight,
    textInputRef,
    textInputProps,
    _onChangeText,
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
    }),
    [actionSheet, locale]
  )

  useEffect(() => {
    if (props.text != null)
      setText(props.text)
  }, [props.text])

  // Only set up keyboard animation when keyboard is internally handled
  useAnimatedReaction(
    () => isKeyboardInternallyHandled ? keyboard.height.value : 0,
    (value, prevValue) => {
      // Skip keyboard handling when not internally handled
      if (!isKeyboardInternallyHandled)
        return

      if (prevValue !== null && value !== prevValue) {
        const isKeyboardMovingUp = value < prevValue
        if (isKeyboardMovingUp !== trackingKeyboardMovement.value) {
          trackingKeyboardMovement.value = isKeyboardMovingUp
          keyboardBottomOffsetAnim.value = withTiming(
            isKeyboardMovingUp ? keyboardBottomOffset : 0,
            {
              // If `keyboardBottomOffset` exists, we change the duration to a smaller value to fix the delay in the keyboard animation speed
              duration: keyboardBottomOffset ? 150 : 400,
            }
          )

          if (focusOnInputWhenOpeningKeyboard)
            if (isKeyboardMovingUp)
              runOnJS(handleTextInputFocusWhenKeyboardShow)()
            else
              runOnJS(handleTextInputFocusWhenKeyboardHide)()
        }
      }
    },
    [
      keyboard,
      trackingKeyboardMovement,
      focusOnInputWhenOpeningKeyboard,
      handleTextInputFocusWhenKeyboardHide,
      handleTextInputFocusWhenKeyboardShow,
      keyboardBottomOffset,
      isKeyboardInternallyHandled,
    ]
  )

  return (
    <GiftedChatContext.Provider value={contextValues}>
      <ActionSheetProvider ref={actionSheetRef}>
        <View
          testID={TEST_ID.WRAPPER}
          style={[stylesCommon.fill, styles.contentContainer]}
          onLayout={onInitialLayoutViewLayout}
        >
          {isInitialized
            ? (
              <Animated.View style={[stylesCommon.fill, isKeyboardInternallyHandled && contentStyleAnim]}>
                {renderMessages}
                {inputToolbarFragment}
              </Animated.View>
            )
            : (
              renderComponentOrElement(renderLoading, {})
            )}
        </View>
      </ActionSheetProvider>
    </GiftedChatContext.Provider>
  )
}

function GiftedChatWrapper<TMessage extends IMessage = IMessage> (props: GiftedChatProps<TMessage>) {
  return (
    <KeyboardProvider>
      <GestureHandlerRootView style={styles.fill}>
        <SafeAreaProvider>
          <GiftedChat<TMessage> {...props} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  )
}

GiftedChatWrapper.append = <TMessage extends IMessage>(
  currentMessages: TMessage[] = [],
  messages: TMessage[],
  inverted = true
) => {
  if (!Array.isArray(messages))
    messages = [messages]

  return inverted
    ? messages.concat(currentMessages)
    : currentMessages.concat(messages)
}

GiftedChatWrapper.prepend = <TMessage extends IMessage>(
  currentMessages: TMessage[] = [],
  messages: TMessage[],
  inverted = true
) => {
  if (!Array.isArray(messages))
    messages = [messages]

  return inverted
    ? currentMessages.concat(messages)
    : messages.concat(currentMessages)
}

export {
  GiftedChatWrapper as GiftedChat
}
