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
  ActionSheetProvider,
  ActionSheetProviderRef,
} from '@expo/react-native-action-sheet'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import {
  Platform,
  TextInput,
  View,
  LayoutChangeEvent,
} from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { Actions } from '../Actions'
import { Avatar } from '../Avatar'
import Bubble from '../Bubble'
import { Composer } from '../Composer'
import { MAX_COMPOSER_HEIGHT, MIN_COMPOSER_HEIGHT, TEST_ID } from '../Constant'
import { Day } from '../Day'
import { GiftedAvatar } from '../GiftedAvatar'
import { GiftedChatContext } from '../GiftedChatContext'
import { InputToolbar } from '../InputToolbar'
import { LoadEarlier } from '../LoadEarlier'
import Message from '../Message'
import MessageContainer, { AnimatedList } from '../MessageContainer'
import { MessageImage } from '../MessageImage'
import { MessageText } from '../MessageText'
import {
  IMessage,
} from '../types'
import { Send } from '../Send'
import { SystemMessage } from '../SystemMessage'
import { Time } from '../Time'
import * as utils from '../utils'
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GiftedChatProps } from './types'

import stylesCommon from '../styles'
import styles from './styles'

dayjs.extend(localizedFormat)

function GiftedChat<TMessage extends IMessage = IMessage> (
  props: GiftedChatProps
) {
  const {
    messages = [],
    initialText = '',
    isTyping,
    messageIdGenerator = () => uuidv4(),
    user = {},
    onSend,
    locale = 'en',
    renderLoading,
    actionSheet = null,
    textInputProps,
    renderChatFooter = null,
    renderInputToolbar = null,
    bottomOffset = 0,
    focusOnInputWhenOpeningKeyboard = true,
    keyboardShouldPersistTaps = Platform.select({
      ios: 'never',
      android: 'always',
      default: 'never',
    }),
    onInputTextChanged = null,
    maxInputLength = null,
    inverted = true,
    minComposerHeight = MIN_COMPOSER_HEIGHT,
    maxComposerHeight = MAX_COMPOSER_HEIGHT,
    isKeyboardInternallyHandled = true,
    isStatusBarTranslucentAndroid,
  } = props

  const actionSheetRef = useRef<ActionSheetProviderRef>(null)

  const messageContainerRef = useMemo(
    () => props.messageContainerRef || createRef<AnimatedList>(),
    [props.messageContainerRef]
  )

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
  const [isTypingDisabled, setIsTypingDisabled] = useState<boolean>(false)

  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid })
  const trackingKeyboardMovement = useSharedValue(false)
  const debounceEnableTypingTimeoutId = useRef<ReturnType<typeof setTimeout>>(undefined)
  const insets = useSafeAreaInsets()
  const keyboardOffsetBottom = useSharedValue(0)

  const contentStyleAnim = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: -keyboard.height.value + keyboardOffsetBottom.value },
      ],
    }),
    [keyboard, keyboardOffsetBottom]
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

  const disableTyping = useCallback(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current)
    setIsTypingDisabled(true)
  }, [])

  const enableTyping = useCallback(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current)
    setIsTypingDisabled(false)
  }, [])

  const debounceEnableTyping = useCallback(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current)
    debounceEnableTypingTimeoutId.current = setTimeout(() => {
      enableTyping()
    }, 50)
  }, [enableTyping])

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

    const fragment = (
      <View style={[stylesCommon.fill, messagesContainerStyle]}>
        <MessageContainer
          {...messagesContainerProps}
          invertibleScrollViewProps={{
            inverted,
            keyboardShouldPersistTaps,
          }}
          messages={messages}
          forwardRef={messageContainerRef}
          isTyping={isTyping}
        />
        {renderChatFooter?.()}
      </View>
    )

    return fragment
  }, [
    isInitialized,
    isTyping,
    messages,
    props,
    inverted,
    keyboardShouldPersistTaps,
    messageContainerRef,
    renderChatFooter,
  ])

  const notifyInputTextReset = useCallback(() => {
    onInputTextChanged?.('')
  }, [onInputTextChanged])

  const resetInputToolbar = useCallback(() => {
    textInputRef.current?.clear()

    notifyInputTextReset()

    setComposerHeight(minComposerHeight!)
    setText(getTextFromProp(''))
    enableTyping()
  }, [
    minComposerHeight,
    getTextFromProp,
    textInputRef,
    notifyInputTextReset,
    enableTyping,
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

      if (shouldResetInputToolbar === true) {
        disableTyping()

        resetInputToolbar()
      }

      onSend?.(newMessages)

      setTimeout(() => scrollToBottom(), 10)
    },
    [messageIdGenerator, onSend, user, resetInputToolbar, disableTyping, scrollToBottom]
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

  const _onInputTextChanged = useCallback(
    (_text: string) => {
      if (isTypingDisabled)
        return

      onInputTextChanged?.(_text)

      // Only set state if it's not being overridden by a prop.
      if (props.text === undefined)
        setText(_text)
    },
    [onInputTextChanged, isTypingDisabled, props.text]
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
      onTextChanged: _onInputTextChanged,
      textInputProps: {
        ...textInputProps,
        ref: textInputRef,
        maxLength: isTypingDisabled ? 0 : maxInputLength,
      },
    }

    if (renderInputToolbar)
      return renderInputToolbar(inputToolbarProps)

    return <InputToolbar {...inputToolbarProps} />
  }, [
    isInitialized,
    _onSend,
    getTextFromProp,
    maxInputLength,
    minComposerHeight,
    onInputSizeChanged,
    props,
    text,
    renderInputToolbar,
    composerHeight,
    isTypingDisabled,
    textInputRef,
    textInputProps,
    _onInputTextChanged,
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

  useAnimatedReaction(
    () => keyboard.height.value,
    (value, prevValue) => {
      if (prevValue !== null && value !== prevValue) {
        const isKeyboardMovingUp = value > prevValue
        if (isKeyboardMovingUp !== trackingKeyboardMovement.value) {
          trackingKeyboardMovement.value = isKeyboardMovingUp
          keyboardOffsetBottom.value = withTiming(
            isKeyboardMovingUp ? insets.bottom + bottomOffset : 0,
            {
              // If `bottomOffset` exists, we change the duration to a smaller value to fix the delay in the keyboard animation speed
              duration: bottomOffset ? 150 : 400,
            }
          )

          if (focusOnInputWhenOpeningKeyboard)
            if (isKeyboardMovingUp)
              runOnJS(handleTextInputFocusWhenKeyboardShow)()
            else
              runOnJS(handleTextInputFocusWhenKeyboardHide)()

          if (value === 0) {
            runOnJS(enableTyping)()
          } else {
            runOnJS(disableTyping)()
            runOnJS(debounceEnableTyping)()
          }
        }
      }
    },
    [
      keyboard,
      trackingKeyboardMovement,
      focusOnInputWhenOpeningKeyboard,
      insets,
      handleTextInputFocusWhenKeyboardHide,
      handleTextInputFocusWhenKeyboardShow,
      enableTyping,
      disableTyping,
      debounceEnableTyping,
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
              renderLoading?.()
            )}
        </View>
      </ActionSheetProvider>
    </GiftedChatContext.Provider>
  )
}

GiftedChat.append = <TMessage extends IMessage>(
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

GiftedChat.prepend = <TMessage extends IMessage>(
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

export * from '../types'

export {
  GiftedChat,
  Actions,
  Avatar,
  Bubble,
  SystemMessage,
  MessageImage,
  MessageText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Message,
  MessageContainer,
  Send,
  Time,
  GiftedAvatar,
  utils
}
