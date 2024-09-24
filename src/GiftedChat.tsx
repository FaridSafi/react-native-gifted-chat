import React, {
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
} from 'react'
import {
  ActionSheetOptions,
  ActionSheetProvider,
  ActionSheetProviderRef,
} from '@expo/react-native-action-sheet'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import {
  FlatList,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native'
import { LightboxProps } from 'react-native-lightbox-v2'
import { v4 as uuidv4 } from 'uuid'
import { Actions, ActionsProps } from './Actions'
import { Avatar, AvatarProps } from './Avatar'
import Bubble from './Bubble'
import { Composer, ComposerProps } from './Composer'
import { MAX_COMPOSER_HEIGHT, MIN_COMPOSER_HEIGHT, TEST_ID } from './Constant'
import { Day, DayProps } from './Day'
import { GiftedAvatar } from './GiftedAvatar'
import { GiftedChatContext } from './GiftedChatContext'
import { InputToolbar, InputToolbarProps } from './InputToolbar'
import { LoadEarlier, LoadEarlierProps } from './LoadEarlier'
import Message from './Message'
import MessageContainer from './MessageContainer'
import { MessageImage, MessageImageProps } from './MessageImage'
import { MessageText, MessageTextProps } from './MessageText'
import {
  IMessage,
  LeftRightStyle,
  MessageAudioProps,
  MessageVideoProps,
  Reply,
  User,
} from './Models'
import { QuickRepliesProps } from './QuickReplies'
import { Send, SendProps } from './Send'
import { SystemMessage, SystemMessageProps } from './SystemMessage'
import { Time, TimeProps } from './Time'
import * as utils from './utils'
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

dayjs.extend(localizedFormat)

export interface GiftedChatProps<TMessage extends IMessage = IMessage> {
  /* Message container ref */
  messageContainerRef?: React.RefObject<FlatList<IMessage>>
  /* text input ref */
  textInputRef?: React.RefObject<TextInput>
  /* Messages to display */
  messages?: TMessage[]
  /* Typing Indicator state */
  isTyping?: boolean
  /* Controls whether or not to show user.name property in the message bubble */
  renderUsernameOnMessage?: boolean
  /* Messages container style */
  messagesContainerStyle?: StyleProp<ViewStyle>
  /* Input text; default is undefined, but if specified, it will override GiftedChat's internal state */
  text?: string
  /* Controls whether or not the message bubbles appear at the top of the chat */
  alignTop?: boolean
  /* enables the scrollToBottom Component */
  scrollToBottom?: boolean
  /* Scroll to bottom wrapper style */
  scrollToBottomStyle?: StyleProp<ViewStyle>
  initialText?: string
  /* Placeholder when text is empty; default is 'Type a message...' */
  placeholder?: string
  /* Makes the composer not editable */
  disableComposer?: boolean
  /* User sending the messages: { _id, name, avatar } */
  user?: User
  /*  Locale to localize the dates */
  locale?: string
  /* Format to use for rendering times; default is 'LT' */
  timeFormat?: string
  /* Format to use for rendering dates; default is 'll' */
  dateFormat?: string
  /* Enables the "Load earlier messages" button */
  loadEarlier?: boolean
  /* Display an ActivityIndicator when loading earlier messages */
  isLoadingEarlier?: boolean
  /* Whether to render an avatar for the current user; default is false, only show avatars for other users */
  showUserAvatar?: boolean
  /* When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is false */
  showAvatarForEveryMessage?: boolean
  /* Render the message avatar at the top of consecutive messages, rather than the bottom; default is false */
  renderAvatarOnTop?: boolean
  inverted?: boolean
  /* Extra props to be passed to the <Image> component created by the default renderMessageImage */
  imageProps?: Message<TMessage>['props']
  /* Extra props to be passed to the MessageImage's Lightbox */
  lightboxProps?: LightboxProps
  /* Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar); default is 0 */
  bottomOffset?: number
  /* Minimum height of the input toolbar; default is 44 */
  minInputToolbarHeight?: number
  /* Extra props to be passed to the messages <ListView>; some props can't be overridden, see the code in MessageContainer.render() for details */
  listViewProps?: object
  /*  Extra props to be passed to the <TextInput> */
  textInputProps?: object
  /* Determines whether the keyboard should stay visible after a tap; see <ScrollView> docs */
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled'
  /* Max message composer TextInput length */
  maxInputLength?: number
  /* Force send button */
  alwaysShowSend?: boolean
  /* Image style */
  imageStyle?: StyleProp<ViewStyle>
  /* This can be used to pass unknown data which needs to be re-rendered */
  extraData?: object
  /* composer min Height */
  minComposerHeight?: number
  /* composer min Height */
  maxComposerHeight?: number
  options?: { [key: string]: () => void }
  optionTintColor?: string
  quickReplyStyle?: StyleProp<ViewStyle>
  quickReplyTextStyle?: StyleProp<TextStyle>
  quickReplyContainerStyle?: StyleProp<ViewStyle>
  /* optional prop used to place customView below text, image and video views; default is false */
  isCustomViewBottom?: boolean
  /* infinite scroll up when reach the top of messages container, automatically call onLoadEarlier function if exist */
  infiniteScroll?: boolean
  timeTextStyle?: LeftRightStyle<TextStyle>
  /** If you use translucent status bar on Android, set this option to true. Ignored on iOS. */
  isStatusBarTranslucentAndroid?: boolean
  /* Custom action sheet */
  actionSheet?(): {
    showActionSheetWithOptions: (
      options: ActionSheetOptions,
      callback: (buttonIndex: number) => void | Promise<void>,
    ) => void
  }
  /* Callback when a message avatar is tapped */
  onPressAvatar?(user: User): void
  /* Callback when a message avatar is tapped */
  onLongPressAvatar?(user: User): void
  /* Generate an id for new messages. Defaults to UUID v4, generated by uuid */
  messageIdGenerator?(message?: TMessage): string
  /* Callback when sending a message */
  onSend?(messages: TMessage[]): void
  /* Callback when loading earlier messages */
  onLoadEarlier?(): void
  /*  Render a loading view when initializing */
  renderLoading?(): React.ReactNode
  /* Custom "Load earlier messages" button */
  renderLoadEarlier?(props: LoadEarlierProps): React.ReactNode
  /* Custom message avatar; set to null to not render any avatar for the message */
  renderAvatar?: null | ((props: AvatarProps<TMessage>) => React.ReactNode)
  /* Custom message bubble */
  renderBubble?(props: Bubble<TMessage>['props']): React.ReactNode
  /* Custom system message */
  renderSystemMessage?(props: SystemMessageProps<TMessage>): React.ReactNode
  /* Callback when a message bubble is pressed; default is to do nothing */
  onPress?(context: unknown, message: TMessage): void
  /* Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see example using showActionSheetWithOptions()) */
  onLongPress?(context: unknown, message: TMessage): void
  /* Custom Username container */
  renderUsername?(user: User): React.ReactNode
  /* Reverses display order of messages; default is true */
  /* Custom message container */
  renderMessage?(message: Message<TMessage>['props']): React.ReactElement
  /* Custom message text */
  renderMessageText?(messageText: MessageTextProps<TMessage>): React.ReactNode
  /* Custom message image */
  renderMessageImage?(props: MessageImageProps<TMessage>): React.ReactNode
  /* Custom message video */
  renderMessageVideo?(props: MessageVideoProps<TMessage>): React.ReactNode
  /* Custom message video */
  renderMessageAudio?(props: MessageAudioProps<TMessage>): React.ReactNode
  /* Custom view inside the bubble */
  renderCustomView?(props: Bubble<TMessage>['props']): React.ReactNode
  /* Custom day above a message */
  renderDay?(props: DayProps<TMessage>): React.ReactNode
  /* Custom time inside a message */
  renderTime?(props: TimeProps<TMessage>): React.ReactNode
  /* Custom footer component on the ListView, e.g. 'User is typing...' */
  renderFooter?(): React.ReactNode
  /* Custom component to render in the ListView when messages are empty */
  renderChatEmpty?(): React.ReactNode
  /* Custom component to render below the MessageContainer (separate from the ListView) */
  renderChatFooter?(): React.ReactNode
  /* Custom message composer container */
  renderInputToolbar?(props: InputToolbarProps<TMessage>): React.ReactNode
  /*  Custom text input message composer */
  renderComposer?(props: ComposerProps): React.ReactNode
  /* Custom action button on the left of the message composer */
  renderActions?(props: ActionsProps): React.ReactNode
  /* Custom send button; you can pass children to the original Send component quite easily, for example to use a custom icon (example) */
  renderSend?(props: SendProps<TMessage>): React.ReactNode
  /* Custom second line of actions below the message composer */
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode
  /* Callback when the Action button is pressed (if set, the default actionSheet will not be used) */
  onPressActionButton?(): void
  /* Callback when the input text changes */
  onInputTextChanged?(text: string): void
  /* Custom parse patterns for react-native-parsed-text used to linking message content (like URLs and phone numbers) */
  parsePatterns?: (linkStyle?: TextStyle) => { type?: string, pattern?: RegExp, style?: StyleProp<TextStyle> | object, onPress?: unknown, renderText?: unknown }[]
  onQuickReply?(replies: Reply[]): void
  renderQuickReplies?(
    quickReplies: QuickRepliesProps<TMessage>,
  ): React.ReactNode
  renderQuickReplySend?(): React.ReactNode
  /* Scroll to bottom custom component */
  scrollToBottomComponent?(): React.ReactNode
  shouldUpdateMessage?(
    props: Message<TMessage>['props'],
    nextProps: Message<TMessage>['props'],
  ): boolean
}

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
    isStatusBarTranslucentAndroid,
  } = props

  const actionSheetRef = useRef<ActionSheetProviderRef>(null)

  const messageContainerRef = useMemo(
    () => props.messageContainerRef || createRef<FlatList<IMessage>>(),
    [props.messageContainerRef]
  )

  const textInputRef = useMemo(
    () => props.textInputRef || createRef<TextInput>(),
    [props.textInputRef]
  )

  const isTextInputWasFocused: MutableRefObject<boolean> = useRef(false)

  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [composerHeight, setComposerHeight] = useState<number>(
    minComposerHeight!
  )
  const [text, setText] = useState<string | undefined>(() => props.text || '')
  const [isTypingDisabled, setIsTypingDisabled] = useState<boolean>(false)

  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid })
  const trackingKeyboardMovement = useSharedValue(false)
  const debounceEnableTypingTimeoutId = useRef<ReturnType<typeof setTimeout>>()
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
      isTextInputWasFocused &&
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
      <View style={[styles.fill, messagesContainerStyle]}>
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
    },
    [messageIdGenerator, onSend, user, resetInputToolbar, disableTyping]
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
      const { layout } = e.nativeEvent

      if (layout.height <= 0)
        return

      notifyInputTextReset()

      setIsInitialized(true)
      setComposerHeight(minComposerHeight!)
      setText(getTextFromProp(initialText))
    },
    [initialText, minComposerHeight, notifyInputTextReset, getTextFromProp]
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

  useEffect(() => {
    if (!inverted && messages?.length)
      setTimeout(() => scrollToBottom(false), 200)
  }, [messages?.length, inverted, scrollToBottom])

  useAnimatedReaction(
    () => keyboard.height.value,
    (value, prevValue) => {
      if (prevValue && value !== prevValue) {
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
          style={[styles.fill, styles.contentContainer]}
          onLayout={onInitialLayoutViewLayout}
        >
          {isInitialized
            ? (
              <Animated.View style={[styles.fill, contentStyleAnim]}>
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

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  contentContainer: {
    overflow: 'hidden',
  },
})

export * from './Models'
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
