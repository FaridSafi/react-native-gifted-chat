import PropTypes from 'prop-types'
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  memo,
} from 'react'
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  SafeAreaView,
  TextStyle,
  KeyboardAvoidingView,
  LayoutChangeEvent,
} from 'react-native'
import {
  ActionSheetProvider,
  ActionSheetOptions,
} from '@expo/react-native-action-sheet'
import uuid from 'uuid'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import * as utils from './utils'
import { Actions, ActionsProps } from './Actions'
import { Avatar, AvatarProps } from './Avatar'
import Bubble from './Bubble'
import { SystemMessage, SystemMessageProps } from './SystemMessage'
import { MessageImage, MessageImageProps } from './MessageImage'
import { MessageText, MessageTextProps } from './MessageText'
import { Composer, ComposerProps } from './Composer'
import { Day, DayProps } from './Day'
import { InputToolbar, InputToolbarProps } from './InputToolbar'
import { LoadEarlier, LoadEarlierProps } from './LoadEarlier'
import Message from './Message'
import MessageContainer from './MessageContainer'
import { Send, SendProps } from './Send'
import { GiftedChatContext } from './GiftedChatContext'
import { Time, TimeProps } from './Time'
import { QuickRepliesProps } from './QuickReplies'
import GiftedAvatar from './GiftedAvatar'
import useMergeState from './hooks/useMergeState'

import {
  MIN_COMPOSER_HEIGHT,
  MAX_COMPOSER_HEIGHT,
  DEFAULT_PLACEHOLDER,
  TIME_FORMAT,
  DATE_FORMAT,
} from './Constant'
import {
  IMessage,
  User,
  Reply,
  LeftRightStyle,
  MessageVideoProps,
  MessageAudioProps,
} from './Models'

dayjs.extend(localizedFormat)

export interface GiftedChatProps<TMessage extends IMessage = IMessage> {
  /* Messages to display */
  messages?: TMessage[]
  /* Typing Indicator state */
  isTyping?: boolean
  /* Messages container style */
  messagesContainerStyle?: StyleProp<ViewStyle>
  /* Input text; default is undefined, but if specified, it will override GiftedChat's internal state */
  text?: string
  /* Controls whether or not the message bubbles appear at the top of the chat */
  alignTop?: boolean
  /* Determine whether is wrapped in a SafeAreaView */
  wrapInSafeArea?: boolean
  /* enables the scrollToBottom Component */
  scrollToBottom?: boolean
  /* Scroll to bottom wrapper style */
  scrollToBottomStyle?: StyleProp<ViewStyle>
  initialText?: string
  /* Placeholder when text is empty; default is 'Type a message...' */
  placeholder?: string
  /* Makes the composer not editable*/
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
  /*Display an ActivityIndicator when loading earlier messages*/
  isLoadingEarlier?: boolean
  /* Whether to render an avatar for the current user; default is false, only show avatars for other users */
  showUserAvatar?: boolean
  /* When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is false */
  showAvatarForEveryMessage?: boolean
  /* Render the message avatar at the top of consecutive messages, rather than the bottom; default is false */
  isKeyboardInternallyHandled?: boolean
  /* Determine whether to handle keyboard awareness inside the plugin. If you have your own keyboard handling outside the plugin set this to false; default is true */
  renderAvatarOnTop?: boolean
  inverted?: boolean
  /* Extra props to be passed to the <Image> component created by the default renderMessageImage */
  imageProps?: Message<TMessage>['props']
  /*Extra props to be passed to the MessageImage's Lightbox */
  lightboxProps?: any
  /*Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar) */
  bottomOffset?: number
  /* Minimum height of the input toolbar; default is 44 */
  minInputToolbarHeight?: number
  /*Extra props to be passed to the messages <ListView>; some props can't be overridden, see the code in MessageContainer.render() for details */
  listViewProps?: any
  /*  Extra props to be passed to the <TextInput> */
  textInputProps?: any
  /*Determines whether the keyboard should stay visible after a tap; see <ScrollView> docs */
  keyboardShouldPersistTaps?: any
  /*Max message composer TextInput length */
  maxInputLength?: number
  /* Force getting keyboard height to fix some display issues */
  forceGetKeyboardHeight?: boolean
  /* Force send button */
  alwaysShowSend?: boolean
  /* Image style */
  imageStyle?: StyleProp<ViewStyle>
  /* This can be used to pass any data which needs to be re-rendered */
  extraData?: any
  /* composer min Height */
  minComposerHeight?: number
  /* composer min Height */
  maxComposerHeight?: number
  options?: { [key: string]: any }
  optionTintColor?: string
  quickReplyStyle?: StyleProp<ViewStyle>
  /* optional prop used to place customView below text, image and video views; default is false */
  isCustomViewBottom?: boolean
  /* infinite scroll up when reach the top of messages container, automatically call onLoadEarlier function if exist */
  infiniteScroll?: boolean
  timeTextStyle?: LeftRightStyle<TextStyle>
  /* Custom action sheet */
  actionSheet?(): {
    showActionSheetWithOptions: (
      options: ActionSheetOptions,
      callback: (i: number) => void,
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
  /*Callback when loading earlier messages*/
  onLoadEarlier?(): void
  /*  Render a loading view when initializing */
  renderLoading?(): React.ReactNode
  /* Custom "Load earlier messages" button */
  renderLoadEarlier?(props: LoadEarlierProps): React.ReactNode
  /* Custom message avatar; set to null to not render any avatar for the message */
  renderAvatar?(props: AvatarProps<TMessage>): React.ReactNode | null
  /* Custom message bubble */
  renderBubble?(props: Bubble<TMessage>['props']): React.ReactNode
  /*Custom system message */
  renderSystemMessage?(props: SystemMessageProps<TMessage>): React.ReactNode
  /* Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see example using showActionSheetWithOptions()) */
  onLongPress?(context: any, message: any): void
  /* Reverses display order of messages; default is true */
  /*Custom message container */
  renderMessage?(message: Message<TMessage>['props']): React.ReactNode
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
  /*Custom day above a message*/
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
  /*Custom second line of actions below the message composer */
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode
  /*Callback when the Action button is pressed (if set, the default actionSheet will not be used) */
  onPressActionButton?(): void
  /* Callback when the input text changes */
  onInputTextChanged?(text: string): void
  /* Custom parse patterns for react-native-parsed-text used to linking message content (like URLs and phone numbers) */
  parsePatterns?(linkStyle: TextStyle): any
  onQuickReply?(replies: Reply[]): void
  renderQuickReplies?(quickReplies: QuickRepliesProps): React.ReactNode
  renderQuickReplySend?(): React.ReactNode
  /* Scroll to bottom custom component */
  scrollToBottomComponent?(): React.ReactNode
  shouldUpdateMessage?(
    props: Message<TMessage>['props'],
    nextProps: Message<TMessage>['props'],
  ): boolean
}

export interface GiftedChatState<TMessage extends IMessage = IMessage> {
  isInitialized: boolean
  composerHeight?: number
  messagesContainerHeight?: number | Animated.Value
  typingDisabled: boolean
  text?: string
}

const GiftedChat: any = memo(
  forwardRef((props: GiftedChatProps<TMessage>, ref: any) => {
    const _this = useRef({
      _isMounted: false,
      _locale: props.locale || 'en',
      _bottomOffset: 0,
      _keyboardHeight: 0,
      _isFirstLayout: true,
      _isTextInputWasFocused: false,
      _actionSheetRef: undefined,
    })

    const textInput = useRef()

    const _messageContainerRef = useRef()

    const [state, setState] = useMergeState({
      isInitialized: false, // initialization will calculate maxHeight before rendering the chat
      composerHeight: props.minComposerHeight,
      messagesContainerHeight: undefined,
      typingDisabled: false,
    })

    const setIsTypingDisabled = useCallback(
      (value: boolean) => setState({ typingDisabled: value }),
      [],
    )

    const getMaxHeight = () => _this.current._maxHeight

    const getMinInputToolbarHeight = () =>
      props.renderAccessory
        ? props.minInputToolbarHeight! * 2
        : props.minInputToolbarHeight

    const calculateInputToolbarHeight = useCallback(
      (composerHeight: number) =>
        composerHeight +
        (getMinInputToolbarHeight()! - props.minComposerHeight!),
      [props.minComposerHeight],
    )

    /**
     * Returns the height, based on current window size, without taking the keyboard into account.
     */
    const getBasicMessagesContainerHeight = useCallback(
      (composerHeight = state.composerHeight) =>
        getMaxHeight()! - calculateInputToolbarHeight(composerHeight!),
      [calculateInputToolbarHeight, state.composerHeight],
    )

    const getKeyboardHeight = () => {
      if (Platform.OS === 'android' && !props.forceGetKeyboardHeight) {
        // For android: on-screen keyboard resized main container and has own height.
        // @see https://developer.android.com/training/keyboard-input/visibility.html
        // So for calculate the messages container height ignore keyboard height.
        return 0
      }
      return _this.current._keyboardHeight
    }

    const getBottomOffset = () => _this.current._bottomOffset

    /**
     * Returns the height, based on current window size, taking the keyboard into account.
     */
    const getMessagesContainerHeightWithKeyboard = useCallback(
      (composerHeight = state.composerHeight) =>
        getBasicMessagesContainerHeight(composerHeight) -
        getKeyboardHeight() +
        getBottomOffset(),
      [getBasicMessagesContainerHeight, state.composerHeight],
    )

    const setIsMounted = (value: boolean) => (_this.current._isMounted = value)

    // const setLocale = (locale: string) => (_this.current._locale = locale)

    // const initLocale = () => {
    //   if (props.locale === null) {
    //     setLocale('en')
    //   } else {
    //     setLocale(props.locale || 'en')
    //   }
    // }

    // const setMessages = (messages: TMessage[]) => setState({ messages })

    const scrollToBottom = (animated = true) => {
      if (_messageContainerRef.current) {
        const { inverted } = props
        if (!inverted) {
          _messageContainerRef.current.scrollToEnd({ animated })
        } else {
          _messageContainerRef.current.scrollToOffset({
            offset: 0,
            animated,
          })
        }
      }
    }

    useEffect(() => {
      // const { messages, text } = props
      setIsMounted(true)
      // initLocale()
      // setMessages(messages || [])
      // setTextFromProp(text)

      return () => {
        setIsMounted(false)
      }
    }, [])

    // useEffect(() => {
    //   const { messages } = props
    //   if (state.messages !== messages) {
    //     setMessages(messages || [])
    //   }
    // }, [props.messages])

    useEffect(() => {
      const { messages, inverted } = props

      if (inverted === false && messages) {
        setTimeout(() => scrollToBottom(false), 200)
      }
    }, [props.messages.length])

    const getLocale = () => _this.current._locale

    const getTextFromProp = useCallback(
      (fallback: string) => {
        if (props.text === undefined) {
          return fallback
        }
        return props.text
      },
      [props.text],
    )

    const setMaxHeight = (height: number) => (_this.current._maxHeight = height)

    const setIsFirstLayout = (value: boolean) =>
      (_this.current._isFirstLayout = value)

    const getIsFirstLayout = () => _this.current._isFirstLayout

    const notifyInputTextReset = useCallback(() => {
      if (props.onInputTextChanged) {
        props.onInputTextChanged('')
      }
    }, [props.onInputTextChanged])

    const onInitialLayoutViewLayout = useCallback(
      (e: any) => {
        const { layout } = e.nativeEvent
        if (layout.height <= 0) {
          return
        }
        notifyInputTextReset()
        setMaxHeight(layout.height)
        const newComposerHeight = props.minComposerHeight
        const newMessagesContainerHeight = getMessagesContainerHeightWithKeyboard(
          newComposerHeight,
        )
        const initialText = props.initialText || ''

        setState({
          isInitialized: true,
          composerHeight: newComposerHeight,
          messagesContainerHeight: newMessagesContainerHeight,
        })
      },
      [
        notifyInputTextReset,
        props.minComposerHeight,
        getMessagesContainerHeightWithKeyboard,
        props.initialText,
        getTextFromProp,
      ],
    )

    const onMainViewLayout = useCallback(
      (e: LayoutChangeEvent) => {
        // TODO: fix an issue when keyboard is dismissing during the initialization
        const { layout } = e.nativeEvent
        if (getMaxHeight() !== layout.height || getIsFirstLayout() === true) {
          setMaxHeight(layout.height)
          setState({
            messagesContainerHeight:
              _this.current._keyboardHeight > 0
                ? getMessagesContainerHeightWithKeyboard()
                : getBasicMessagesContainerHeight(),
          })
        }
        if (getIsFirstLayout() === true) {
          setIsFirstLayout(false)
        }
      },
      [getMessagesContainerHeightWithKeyboard, getBasicMessagesContainerHeight],
    )

    const focusTextInput = () => {
      if (textInput.current) {
        textInput.current.focus()
      }
    }

    if (ref) {
      ref.current = _this.current
      ref.current.scrollToBottom = scrollToBottom
    }

    console.log(ref)

    if (state.isInitialized === true) {
      const { wrapInSafeArea } = props
      const Wrapper = wrapInSafeArea ? SafeAreaView : View
      const actionSheet =
        props.actionSheet || (() => _this.current._actionSheetRef?.getContext())

      return (
        <GiftedChatContext.Provider
          value={{
            actionSheet,
            getLocale,
          }}
        >
          <Wrapper style={styles.safeArea}>
            <ActionSheetProvider
            // ref={_this.current._actionSheetRef}
            >
              <View style={styles.container} onLayout={onMainViewLayout}>
                <RenderMessages
                  messages={props.messages}
                  isTyping={props.isTyping}
                  messagesContainerStyle={props.messagesContainerStyle}
                  isKeyboardInternallyHandled={
                    props.isKeyboardInternallyHandled
                  }
                  renderChatFooter={props.renderChatFooter}
                  inverted={props.inverted}
                  keyboardShouldPersistTaps={props.keyboardShouldPersistTaps}
                  messagesContainerProps={props}
                  messageContainerRef={_messageContainerRef}
                  messagesContainerHeight={state.messagesContainerHeight}
                  setIsTypingDisabled={setIsTypingDisabled}
                  textInput={textInput}
                  _this={_this}
                  setState={setState}
                  getMessagesContainerHeightWithKeyboard={
                    getMessagesContainerHeightWithKeyboard
                  }
                  getBasicMessagesContainerHeight={
                    getBasicMessagesContainerHeight
                  }
                />
                {
                  <RenderInputToolbar
                    minComposerHeight={props.minComposerHeight}
                    maxInputLength={props.maxInputLength}
                    maxComposerHeight={props.maxComposerHeight}
                    renderInputToolbar={props.renderInputToolbar}
                    messageIdGenerator={props.messageIdGenerator}
                    user={props.user}
                    onSend={props.onSend}
                    onInputTextChanged={props.onInputTextChanged}
                    baseProps={props}
                    propsText={props.text}
                    textInput={textInput}
                    composerHeight={state.composerHeight}
                    getTextFromProp={getTextFromProp}
                    setState={setState}
                    getMessagesContainerHeightWithKeyboard={
                      getMessagesContainerHeightWithKeyboard
                    }
                    _this={_this}
                    notifyInputTextReset={notifyInputTextReset}
                    setIsTypingDisabled={setIsTypingDisabled}
                    baseRef={ref}
                    typingDisabled={state.typingDisabled}
                  />
                }
              </View>
            </ActionSheetProvider>
          </Wrapper>
        </GiftedChatContext.Provider>
      )
    }

    return (
      <View style={styles.container} onLayout={onInitialLayoutViewLayout}>
        {props.renderLoading && props.renderLoading()}
      </View>
    )
  }),
)

const RenderInputToolbar: any = memo(
  ({
    getTextFromProp,
    baseProps,
    minComposerHeight,
    maxComposerHeight,
    composerHeight,
    textInput,
    maxInputLength,
    renderInputToolbar,
    setState,
    getMessagesContainerHeightWithKeyboard,
    messageIdGenerator,
    user,
    onSend: propsOnSend,
    _this,
    notifyInputTextReset,
    setIsTypingDisabled,
    baseRef,
    typingDisabled,
    onInputTextChanged: propsOnInputTextChanged,
    propsText,
  }: any) => {
    const [text, setText] = useState(propsText)

    const setTextFromProp = (textProp?: string) => {
      // Text prop takes precedence over state.
      if (textProp !== undefined && textProp !== text) {
        setText(textProp)
      }
    }

    useEffect(() => {
      setTextFromProp(propsText)
    }, [propsText])
    console.log(2)

    const onInputSizeChanged = useCallback(
      (size: { height: number }) => {
        const newComposerHeight = Math.max(
          minComposerHeight!,
          Math.min(maxComposerHeight!, size.height),
        )
        const newMessagesContainerHeight = getMessagesContainerHeightWithKeyboard(
          newComposerHeight,
        )
        setState({
          composerHeight: newComposerHeight,
          messagesContainerHeight: newMessagesContainerHeight,
        })
      },
      [
        minComposerHeight,
        maxComposerHeight,
        getMessagesContainerHeightWithKeyboard,
      ],
    )

    const getIsMounted = () => _this.current._isMounted

    const resetInputToolbar = useCallback(() => {
      if (textInput.current) {
        textInput.current.clear()
      }
      notifyInputTextReset()
      const newComposerHeight = minComposerHeight
      const newMessagesContainerHeight = getMessagesContainerHeightWithKeyboard(
        newComposerHeight,
      )
      setText(getTextFromProp(''))
      setState({
        composerHeight: newComposerHeight,
        messagesContainerHeight: newMessagesContainerHeight,
      })
    }, [
      notifyInputTextReset,
      minComposerHeight,
      getMessagesContainerHeightWithKeyboard,
      getTextFromProp,
    ])

    const onSend = useCallback(
      (messages: TMessage[] = [], shouldResetInputToolbar = false) => {
        if (!Array.isArray(messages)) {
          messages = [messages]
        }
        const newMessages: TMessage[] = messages.map(message => {
          return {
            ...message,
            user: user!,
            createdAt: new Date(),
            _id: messageIdGenerator && messageIdGenerator(),
          }
        })

        if (shouldResetInputToolbar === true) {
          setIsTypingDisabled(true)
          resetInputToolbar()
        }
        if (propsOnSend) {
          propsOnSend(newMessages)
        }

        if (shouldResetInputToolbar === true) {
          setTimeout(() => {
            if (getIsMounted() === true) {
              setIsTypingDisabled(false)
            }
          }, 100)
        }
      },
      [
        user,
        messageIdGenerator,
        resetInputToolbar,
        propsOnSend,
        setIsTypingDisabled,
      ],
    )

    const getIsTypingDisabled = useCallback(() => typingDisabled, [
      typingDisabled,
    ])

    const onInputTextChanged = useCallback(
      (text: string) => {
        if (getIsTypingDisabled()) {
          return
        }
        if (propsOnInputTextChanged) {
          propsOnInputTextChanged(text)
        }
        // Only set state if it's not being overridden by a prop.
        if (propsText === undefined) {
          setText(text)
        }
      },
      [getIsTypingDisabled, propsOnInputTextChanged, propsText],
    )

    const inputToolbarProps = {
      ...baseProps,
      text: getTextFromProp(text!),
      composerHeight: Math.max(minComposerHeight!, composerHeight!),
      onSend,
      onInputSizeChanged,
      onTextChanged: onInputTextChanged,
      textInputProps: {
        ...baseProps.textInputProps,
        ref: textInput,
        maxLength: getIsTypingDisabled() ? 0 : maxInputLength,
      },
    }

    if (baseRef) {
      baseRef.current.onSend = onSend
    }

    if (renderInputToolbar) {
      return renderInputToolbar(inputToolbarProps)
    }
    return <InputToolbar {...inputToolbarProps} />
  },
)

const RenderMessages: any = memo(
  ({
    messagesContainerHeight,
    messages,
    messageContainerRef,
    isTyping,
    messagesContainerStyle,
    isKeyboardInternallyHandled,
    renderChatFooter,
    inverted,
    keyboardShouldPersistTaps,
    setIsTypingDisabled,
    getBasicMessagesContainerHeight,
    getMessagesContainerHeightWithKeyboard,
    textInput,
    setState,
    _this,
    messagesContainerProps,
  }: any) => {
    console.log(1)

    const setBottomOffset = (value: number) =>
      (_this.current._bottomOffset = value)

    const safeAreaSupport = (bottomOffset?: number) =>
      bottomOffset != null ? bottomOffset : getBottomSpace()

    const setKeyboardHeight = (height: number) =>
      (_this.current._keyboardHeight = height)

    /**
     * Refocus the text input only if it was focused before showing keyboard.
     * This is needed in some cases (eg. showing image picker).
     */
    const handleTextInputFocusWhenKeyboardShow = useCallback(() => {
      if (
        textInput.current &&
        _this.current._isTextInputWasFocused &&
        !textInput.current.isFocused()
      ) {
        textInput.current.focus()
      }

      // Reset the indicator since the keyboard is shown
      _this.current._isTextInputWasFocused = false
    }, [])

    const onKeyboardWillShow = useCallback(
      (e: any) => {
        handleTextInputFocusWhenKeyboardShow()

        if (isKeyboardInternallyHandled) {
          setIsTypingDisabled(true)
          setKeyboardHeight(
            e.endCoordinates ? e.endCoordinates.height : e.end.height,
          )
          setBottomOffset(safeAreaSupport(_this.current._bottomOffset))
          const newMessagesContainerHeight = getMessagesContainerHeightWithKeyboard()
          setState({
            messagesContainerHeight: newMessagesContainerHeight,
          })
        }
      },
      [
        handleTextInputFocusWhenKeyboardShow,
        isKeyboardInternallyHandled,
        _this.current._bottomOffset,
        getMessagesContainerHeightWithKeyboard,
      ],
    )

    /**
     * Store text input focus status when keyboard hide to retrieve
     * it after wards if needed.
     * `onKeyboardWillHide` may be called twice in sequence so we
     * make a guard condition (eg. showing image picker)
     */
    const handleTextInputFocusWhenKeyboardHide = () => {
      if (!_this.current._isTextInputWasFocused) {
        _this.current._isTextInputWasFocused =
          textInput.current?.isFocused() || false
      }
    }

    const onKeyboardWillHide = useCallback(
      (_e: any) => {
        handleTextInputFocusWhenKeyboardHide()

        if (isKeyboardInternallyHandled) {
          setIsTypingDisabled(true)
          setKeyboardHeight(0)
          setBottomOffset(0)
          const newMessagesContainerHeight = getBasicMessagesContainerHeight()
          setState({
            messagesContainerHeight: newMessagesContainerHeight,
          })
        }
      },
      [
        handleTextInputFocusWhenKeyboardHide,
        isKeyboardInternallyHandled,
        getBasicMessagesContainerHeight,
      ],
    )

    const onKeyboardDidShow = useCallback(
      (e: any) => {
        onKeyboardWillShow(e)
        setIsTypingDisabled(false)
      },
      [onKeyboardWillShow],
    )

    const onKeyboardDidHide = useCallback(
      (e: any) => {
        onKeyboardWillHide(e)
        setIsTypingDisabled(false)
      },
      [onKeyboardWillHide],
    )

    const invertibleScrollViewProps = useMemo(
      () =>
        Platform.select({
          ios: {
            inverted,
            keyboardShouldPersistTaps,
            onKeyboardWillShow,
            onKeyboardWillHide,
          },
          android: {
            inverted,
            keyboardShouldPersistTaps,
            onKeyboardDidShow,
            onKeyboardDidHide,
          },
        }),
      [
        inverted,
        keyboardShouldPersistTaps,
        onKeyboardWillShow,
        onKeyboardWillHide,
        onKeyboardDidShow,
        onKeyboardDidHide,
      ],
    )

    const KeyboardAvoidableView = useMemo(
      () => (isKeyboardInternallyHandled ? KeyboardAvoidingView : View),
      [isKeyboardInternallyHandled],
    )

    const style = useMemo(
      () => [
        {
          height: messagesContainerHeight,
        },
        messagesContainerStyle,
      ],
      [messagesContainerHeight, messagesContainerStyle],
    )

    return (
      <KeyboardAvoidableView
        enabled={!!isKeyboardInternallyHandled}
        style={style}
      >
        <MessageContainer<TMessage>
          {...messagesContainerProps}
          invertibleScrollViewProps={invertibleScrollViewProps}
          messages={messages}
          forwardRef={messageContainerRef}
          isTyping={isTyping}
        />
        {renderChatFooter && renderChatFooter()}
      </KeyboardAvoidableView>
    )
  },
)

GiftedChat.defaultProps = {
  messages: [],
  messagesContainerStyle: undefined,
  text: undefined,
  placeholder: DEFAULT_PLACEHOLDER,
  disableComposer: false,
  messageIdGenerator: () => uuid.v4(),
  user: {},
  onSend: () => {},
  locale: null,
  timeFormat: TIME_FORMAT,
  dateFormat: DATE_FORMAT,
  loadEarlier: false,
  onLoadEarlier: () => {},
  isLoadingEarlier: false,
  renderLoading: null,
  renderLoadEarlier: null,
  renderAvatar: undefined,
  showUserAvatar: false,
  actionSheet: null,
  onPressAvatar: null,
  onLongPressAvatar: null,
  renderUsernameOnMessage: false,
  renderAvatarOnTop: false,
  renderBubble: null,
  renderSystemMessage: null,
  onLongPress: null,
  renderMessage: null,
  renderMessageText: null,
  renderMessageImage: null,
  renderMessageVideo: null,
  renderMessageAudio: null,
  imageProps: {},
  videoProps: {},
  audioProps: {},
  lightboxProps: {},
  textInputProps: {},
  listViewProps: {},
  renderCustomView: null,
  isCustomViewBottom: false,
  renderDay: null,
  renderTime: null,
  renderFooter: null,
  renderChatEmpty: null,
  renderChatFooter: null,
  renderInputToolbar: null,
  renderComposer: null,
  renderActions: null,
  renderSend: null,
  renderAccessory: null,
  isKeyboardInternallyHandled: true,
  onPressActionButton: null,
  bottomOffset: null,
  minInputToolbarHeight: 44,
  keyboardShouldPersistTaps: Platform.select({
    ios: 'never',
    android: 'always',
    default: 'never',
  }),
  onInputTextChanged: null,
  maxInputLength: null,
  forceGetKeyboardHeight: false,
  inverted: true,
  extraData: null,
  minComposerHeight: MIN_COMPOSER_HEIGHT,
  maxComposerHeight: MAX_COMPOSER_HEIGHT,
  wrapInSafeArea: true,
}

GiftedChat.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  messagesContainerStyle: utils.StylePropType,
  text: PropTypes.string,
  initialText: PropTypes.string,
  placeholder: PropTypes.string,
  disableComposer: PropTypes.bool,
  messageIdGenerator: PropTypes.func,
  user: PropTypes.object,
  onSend: PropTypes.func,
  locale: PropTypes.string,
  timeFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  isKeyboardInternallyHandled: PropTypes.bool,
  loadEarlier: PropTypes.bool,
  onLoadEarlier: PropTypes.func,
  isLoadingEarlier: PropTypes.bool,
  renderLoading: PropTypes.func,
  renderLoadEarlier: PropTypes.func,
  renderAvatar: PropTypes.func,
  showUserAvatar: PropTypes.bool,
  actionSheet: PropTypes.func,
  onPressAvatar: PropTypes.func,
  onLongPressAvatar: PropTypes.func,
  renderUsernameOnMessage: PropTypes.bool,
  renderAvatarOnTop: PropTypes.bool,
  isCustomViewBottom: PropTypes.bool,
  renderBubble: PropTypes.func,
  renderSystemMessage: PropTypes.func,
  onLongPress: PropTypes.func,
  renderMessage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderMessageImage: PropTypes.func,
  imageProps: PropTypes.object,
  videoProps: PropTypes.object,
  audioProps: PropTypes.object,
  lightboxProps: PropTypes.object,
  renderCustomView: PropTypes.func,
  renderDay: PropTypes.func,
  renderTime: PropTypes.func,
  renderFooter: PropTypes.func,
  renderChatEmpty: PropTypes.func,
  renderChatFooter: PropTypes.func,
  renderInputToolbar: PropTypes.func,
  renderComposer: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderAccessory: PropTypes.func,
  onPressActionButton: PropTypes.func,
  bottomOffset: PropTypes.number,
  minInputToolbarHeight: PropTypes.number,
  listViewProps: PropTypes.object,
  keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled']),
  onInputTextChanged: PropTypes.func,
  maxInputLength: PropTypes.number,
  forceGetKeyboardHeight: PropTypes.bool,
  inverted: PropTypes.bool,
  textInputProps: PropTypes.object,
  extraData: PropTypes.object,
  minComposerHeight: PropTypes.number,
  maxComposerHeight: PropTypes.number,
  alignTop: PropTypes.bool,
  wrapInSafeArea: PropTypes.bool,
}

GiftedChat.append = <TMessage extends IMessage>(
  currentMessages: TMessage[] = [],
  messages: TMessage[],
  inverted = true,
) => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }
  return inverted
    ? messages.concat(currentMessages)
    : currentMessages.concat(messages)
}

GiftedChat.prepend = <TMessage extends IMessage>(
  currentMessages: TMessage[] = [],
  messages: TMessage[],
  inverted = true,
) => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }
  return inverted
    ? currentMessages.concat(messages)
    : messages.concat(currentMessages)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
  utils,
}
