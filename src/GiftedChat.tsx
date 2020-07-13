import PropTypes from 'prop-types'
import React, { RefObject } from 'react'
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  SafeAreaView,
  FlatList,
  TextStyle,
  KeyboardAvoidingView,
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
import Actions from './Actions'
import Avatar from './Avatar'
import Bubble from './Bubble'
import SystemMessage from './SystemMessage'
import MessageImage from './MessageImage'
import MessageText from './MessageText'
import Composer from './Composer'
import Day from './Day'
import InputToolbar from './InputToolbar'
import LoadEarlier from './LoadEarlier'
import Message from './Message'
import MessageContainer from './MessageContainer'
import Send from './Send'
import Time from './Time'
import GiftedAvatar from './GiftedAvatar'

import {
  MIN_COMPOSER_HEIGHT,
  MAX_COMPOSER_HEIGHT,
  DEFAULT_PLACEHOLDER,
  TIME_FORMAT,
  DATE_FORMAT,
} from './Constant'
import { IMessage, User, Reply, LeftRightStyle } from './Models'
import QuickReplies from './QuickReplies'

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
  renderLoadEarlier?(props: LoadEarlier['props']): React.ReactNode
  /* Custom message avatar; set to null to not render any avatar for the message */
  renderAvatar?(props: Avatar<TMessage>['props']): React.ReactNode | null
  /* Custom message bubble */
  renderBubble?(props: Bubble<TMessage>['props']): React.ReactNode
  /*Custom system message */
  renderSystemMessage?(props: SystemMessage<TMessage>['props']): React.ReactNode
  /* Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see example using showActionSheetWithOptions()) */
  onLongPress?(context: any, message: any): void
  /* Reverses display order of messages; default is true */
  /*Custom message container */
  renderMessage?(message: Message<TMessage>['props']): React.ReactNode
  /* Custom message text */
  renderMessageText?(
    messageText: MessageText<TMessage>['props'],
  ): React.ReactNode
  /* Custom message image */
  renderMessageImage?(props: MessageImage<TMessage>['props']): React.ReactNode
  /* Custom message video */
  renderMessageVideo?(props: MessageImage<TMessage>['props']): React.ReactNode
  /* Custom view inside the bubble */
  renderCustomView?(props: Bubble<TMessage>['props']): React.ReactNode
  /*Custom day above a message*/
  renderDay?(props: Day<TMessage>['props']): React.ReactNode
  /* Custom time inside a message */
  renderTime?(props: Time<TMessage>['props']): React.ReactNode
  /* Custom footer component on the ListView, e.g. 'User is typing...' */
  renderFooter?(): React.ReactNode
  /* Custom component to render in the ListView when messages are empty */
  renderChatEmpty?(): React.ReactNode
  /* Custom component to render below the MessageContainer (separate from the ListView) */
  renderChatFooter?(): React.ReactNode
  /* Custom message composer container */
  renderInputToolbar?(props: InputToolbar['props']): React.ReactNode
  /*  Custom text input message composer */
  renderComposer?(props: Composer['props']): React.ReactNode
  /* Custom action button on the left of the message composer */
  renderActions?(props: Actions['props']): React.ReactNode
  /* Custom send button; you can pass children to the original Send component quite easily, for example to use a custom icon (example) */
  renderSend?(props: Send['props']): React.ReactNode
  /*Custom second line of actions below the message composer */
  renderAccessory?(props: InputToolbar['props']): React.ReactNode
  /*Callback when the Action button is pressed (if set, the default actionSheet will not be used) */
  onPressActionButton?(): void
  /* Callback when the input text changes */
  onInputTextChanged?(text: string): void
  /* Custom parse patterns for react-native-parsed-text used to linking message content (like URLs and phone numbers) */
  parsePatterns?(linkStyle: TextStyle): any
  onQuickReply?(replies: Reply[]): void
  renderQuickReplies?(quickReplies: QuickReplies['props']): React.ReactNode
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
  messages?: TMessage[]
}

class GiftedChat<TMessage extends IMessage = IMessage> extends React.Component<
  GiftedChatProps<TMessage>,
  GiftedChatState
> {
  static childContextTypes = {
    actionSheet: PropTypes.func,
    getLocale: PropTypes.func,
  }

  static defaultProps = {
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

  static propTypes = {
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

  static append<TMessage extends IMessage>(
    currentMessages: TMessage[] = [],
    messages: TMessage[],
    inverted = true,
  ) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    return inverted
      ? messages.concat(currentMessages)
      : currentMessages.concat(messages)
  }

  static prepend<TMessage extends IMessage>(
    currentMessages: TMessage[] = [],
    messages: TMessage[],
    inverted = true,
  ) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    return inverted
      ? currentMessages.concat(messages)
      : messages.concat(currentMessages)
  }

  _isMounted: boolean = false
  _keyboardHeight: number = 0
  _bottomOffset: number = 0
  _maxHeight?: number = undefined
  _isFirstLayout: boolean = true
  _locale: string = 'en'
  invertibleScrollViewProps: any = undefined
  _actionSheetRef: any = undefined
  _messageContainerRef?: RefObject<FlatList<IMessage>> = React.createRef()
  _isTextInputWasFocused: boolean = false
  textInput?: any

  state = {
    isInitialized: false, // initialization will calculate maxHeight before rendering the chat
    composerHeight: this.props.minComposerHeight,
    messagesContainerHeight: undefined,
    typingDisabled: false,
    text: undefined,
    messages: undefined,
  }

  constructor(props: GiftedChatProps<TMessage>) {
    super(props)

    this.invertibleScrollViewProps = {
      inverted: this.props.inverted,
      keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps,
      onKeyboardWillShow: this.onKeyboardWillShow,
      onKeyboardWillHide: this.onKeyboardWillHide,
      onKeyboardDidShow: this.onKeyboardDidShow,
      onKeyboardDidHide: this.onKeyboardDidHide,
    }
  }

  getChildContext() {
    return {
      actionSheet:
        this.props.actionSheet || (() => this._actionSheetRef.getContext()),
      getLocale: this.getLocale,
    }
  }

  componentDidMount() {
    const { messages, text } = this.props
    this.setIsMounted(true)
    this.initLocale()
    this.setMessages(messages || [])
    this.setTextFromProp(text)
  }

  componentWillUnmount() {
    this.setIsMounted(false)
  }

  componentDidUpdate(prevProps: GiftedChatProps<TMessage> = {}) {
    const { messages, text, inverted } = this.props

    if (this.props !== prevProps) {
      this.setMessages(messages || [])
    }

    if (
      inverted === false &&
      messages &&
      prevProps.messages &&
      messages.length !== prevProps.messages.length
    ) {
      setTimeout(() => this.scrollToBottom(false), 200)
    }

    if (text !== prevProps.text) {
      this.setTextFromProp(text)
    }
  }

  initLocale() {
    if (this.props.locale === null) {
      this.setLocale('en')
    } else {
      this.setLocale(this.props.locale || 'en')
    }
  }

  setLocale(locale: string) {
    this._locale = locale
  }

  getLocale = () => this._locale

  setTextFromProp(textProp?: string) {
    // Text prop takes precedence over state.
    if (textProp !== undefined && textProp !== this.state.text) {
      this.setState({ text: textProp })
    }
  }

  getTextFromProp(fallback: string) {
    if (this.props.text === undefined) {
      return fallback
    }
    return this.props.text
  }

  setMessages(messages: TMessage[]) {
    this.setState({ messages })
  }

  getMessages() {
    return this.state.messages
  }

  setMaxHeight(height: number) {
    this._maxHeight = height
  }

  getMaxHeight() {
    return this._maxHeight
  }

  setKeyboardHeight(height: number) {
    this._keyboardHeight = height
  }

  getKeyboardHeight() {
    if (Platform.OS === 'android' && !this.props.forceGetKeyboardHeight) {
      // For android: on-screen keyboard resized main container and has own height.
      // @see https://developer.android.com/training/keyboard-input/visibility.html
      // So for calculate the messages container height ignore keyboard height.
      return 0
    }
    return this._keyboardHeight
  }

  setBottomOffset(value: number) {
    this._bottomOffset = value
  }

  getBottomOffset() {
    return this._bottomOffset
  }

  setIsFirstLayout(value: boolean) {
    this._isFirstLayout = value
  }

  getIsFirstLayout() {
    return this._isFirstLayout
  }

  setIsTypingDisabled(value: boolean) {
    this.setState({
      typingDisabled: value,
    })
  }

  getIsTypingDisabled() {
    return this.state.typingDisabled
  }

  setIsMounted(value: boolean) {
    this._isMounted = value
  }

  getIsMounted() {
    return this._isMounted
  }

  getMinInputToolbarHeight() {
    return this.props.renderAccessory
      ? this.props.minInputToolbarHeight! * 2
      : this.props.minInputToolbarHeight
  }

  calculateInputToolbarHeight(composerHeight: number) {
    return (
      composerHeight +
      (this.getMinInputToolbarHeight()! - this.props.minComposerHeight!)
    )
  }

  /**
   * Returns the height, based on current window size, without taking the keyboard into account.
   */
  getBasicMessagesContainerHeight(composerHeight = this.state.composerHeight) {
    return (
      this.getMaxHeight()! - this.calculateInputToolbarHeight(composerHeight!)
    )
  }

  /**
   * Returns the height, based on current window size, taking the keyboard into account.
   */
  getMessagesContainerHeightWithKeyboard(
    composerHeight = this.state.composerHeight,
  ) {
    return (
      this.getBasicMessagesContainerHeight(composerHeight) -
      this.getKeyboardHeight() +
      this.getBottomOffset()
    )
  }

  safeAreaSupport = (bottomOffset?: number) => {
    return bottomOffset != null ? bottomOffset : getBottomSpace()
  }

  /**
   * Store text input focus status when keyboard hide to retrieve
   * it after wards if needed.
   * `onKeyboardWillHide` may be called twice in sequence so we
   * make a guard condition (eg. showing image picker)
   */
  handleTextInputFocusWhenKeyboardHide() {
    if (!this._isTextInputWasFocused) {
      this._isTextInputWasFocused = this.textInput?.isFocused() || false
    }
  }

  /**
   * Refocus the text input only if it was focused before showing keyboard.
   * This is needed in some cases (eg. showing image picker).
   */
  handleTextInputFocusWhenKeyboardShow() {
    if (
      this.textInput &&
      this._isTextInputWasFocused &&
      !this.textInput.isFocused()
    ) {
      this.textInput.focus()
    }

    // Reset the indicator since the keyboard is shown
    this._isTextInputWasFocused = false
  }

  onKeyboardWillShow = (e: any) => {
    this.handleTextInputFocusWhenKeyboardShow()

    if (this.props.isKeyboardInternallyHandled) {
      this.setIsTypingDisabled(true)
      this.setKeyboardHeight(
        e.endCoordinates ? e.endCoordinates.height : e.end.height,
      )
      this.setBottomOffset(this.safeAreaSupport(this.props.bottomOffset))
      const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard()
      this.setState({
        messagesContainerHeight: newMessagesContainerHeight,
      })
    }
  }

  onKeyboardWillHide = (_e: any) => {
    this.handleTextInputFocusWhenKeyboardHide()

    if (this.props.isKeyboardInternallyHandled) {
      this.setIsTypingDisabled(true)
      this.setKeyboardHeight(0)
      this.setBottomOffset(0)
      const newMessagesContainerHeight = this.getBasicMessagesContainerHeight()
      this.setState({
        messagesContainerHeight: newMessagesContainerHeight,
      })
    }
  }

  onKeyboardDidShow = (e: any) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e)
    }
    this.setIsTypingDisabled(false)
  }

  onKeyboardDidHide = (e: any) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e)
    }
    this.setIsTypingDisabled(false)
  }

  scrollToBottom(animated = true) {
    if (this._messageContainerRef && this._messageContainerRef.current) {
      const { inverted } = this.props
      if (!inverted) {
        this._messageContainerRef.current.scrollToEnd({ animated })
      } else {
        this._messageContainerRef.current.scrollToOffset({
          offset: 0,
          animated,
        })
      }
    }
  }

  renderMessages() {
    const { messagesContainerStyle, ...messagesContainerProps } = this.props
    const fragment = (
      <View
        style={[
          {
            height: this.state.messagesContainerHeight,
          },
          messagesContainerStyle,
        ]}
      >
        <MessageContainer<TMessage>
          {...messagesContainerProps}
          invertibleScrollViewProps={this.invertibleScrollViewProps}
          messages={this.getMessages()}
          forwardRef={this._messageContainerRef}
          isTyping={this.props.isTyping}
        />
        {this.renderChatFooter()}
      </View>
    )

    return this.props.isKeyboardInternallyHandled ? (
      <KeyboardAvoidingView enabled>{fragment}</KeyboardAvoidingView>
    ) : (
      fragment
    )
  }

  onSend = (messages: TMessage[] = [], shouldResetInputToolbar = false) => {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    const newMessages: TMessage[] = messages.map(message => {
      return {
        ...message,
        user: this.props.user!,
        createdAt: new Date(),
        _id: this.props.messageIdGenerator && this.props.messageIdGenerator(),
      }
    })

    if (shouldResetInputToolbar === true) {
      this.setIsTypingDisabled(true)
      this.resetInputToolbar()
    }
    if (this.props.onSend) {
      this.props.onSend(newMessages)
    }

    if (shouldResetInputToolbar === true) {
      setTimeout(() => {
        if (this.getIsMounted() === true) {
          this.setIsTypingDisabled(false)
        }
      }, 100)
    }
  }

  resetInputToolbar() {
    if (this.textInput) {
      this.textInput.clear()
    }
    this.notifyInputTextReset()
    const newComposerHeight = this.props.minComposerHeight
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(
      newComposerHeight,
    )
    this.setState({
      text: this.getTextFromProp(''),
      composerHeight: newComposerHeight,
      messagesContainerHeight: newMessagesContainerHeight,
    })
  }

  focusTextInput() {
    if (this.textInput) {
      this.textInput.focus()
    }
  }

  onInputSizeChanged = (size: { height: number }) => {
    const newComposerHeight = Math.max(
      this.props.minComposerHeight!,
      Math.min(this.props.maxComposerHeight!, size.height),
    )
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(
      newComposerHeight,
    )
    this.setState({
      composerHeight: newComposerHeight,
      messagesContainerHeight: newMessagesContainerHeight,
    })
  }

  onInputTextChanged = (text: string) => {
    if (this.getIsTypingDisabled()) {
      return
    }
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged(text)
    }
    // Only set state if it's not being overridden by a prop.
    if (this.props.text === undefined) {
      this.setState({ text })
    }
  }

  notifyInputTextReset() {
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged('')
    }
  }

  onInitialLayoutViewLayout = (e: any) => {
    const { layout } = e.nativeEvent
    if (layout.height <= 0) {
      return
    }
    this.notifyInputTextReset()
    this.setMaxHeight(layout.height)
    const newComposerHeight = this.props.minComposerHeight
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(
      newComposerHeight,
    )
    const initialText = this.props.initialText || ''
    this.setState({
      isInitialized: true,
      text: this.getTextFromProp(initialText),
      composerHeight: newComposerHeight,
      messagesContainerHeight: newMessagesContainerHeight,
    })
  }

  onMainViewLayout = (e: any) => {
    // fix an issue when keyboard is dismissing during the initialization
    const { layout } = e.nativeEvent
    if (
      this.getMaxHeight() !== layout.height ||
      this.getIsFirstLayout() === true
    ) {
      this.setMaxHeight(layout.height)
      this.setState({
        messagesContainerHeight:
          this._keyboardHeight > 0
            ? this.getMessagesContainerHeightWithKeyboard()
            : this.getBasicMessagesContainerHeight(),
      })
    }
    if (this.getIsFirstLayout() === true) {
      this.setIsFirstLayout(false)
    }
  }

  renderInputToolbar() {
    const inputToolbarProps = {
      ...this.props,
      text: this.getTextFromProp(this.state.text!),
      composerHeight: Math.max(
        this.props.minComposerHeight!,
        this.state.composerHeight!,
      ),
      onSend: this.onSend,
      onInputSizeChanged: this.onInputSizeChanged,
      onTextChanged: this.onInputTextChanged,
      textInputProps: {
        ...this.props.textInputProps,
        ref: (textInput: any) => (this.textInput = textInput),
        maxLength: this.getIsTypingDisabled() ? 0 : this.props.maxInputLength,
      },
    }
    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps)
    }
    return <InputToolbar {...inputToolbarProps} />
  }

  renderChatFooter() {
    if (this.props.renderChatFooter) {
      return this.props.renderChatFooter()
    }
    return null
  }

  renderLoading() {
    if (this.props.renderLoading) {
      return this.props.renderLoading()
    }
    return null
  }

  render() {
    if (this.state.isInitialized === true) {
      const { wrapInSafeArea } = this.props
      const Wrapper = wrapInSafeArea ? SafeAreaView : View

      return (
        <Wrapper style={styles.safeArea}>
          <ActionSheetProvider
            ref={(component: any) => (this._actionSheetRef = component)}
          >
            <View style={styles.container} onLayout={this.onMainViewLayout}>
              {this.renderMessages()}
              {this.renderInputToolbar()}
            </View>
          </ActionSheetProvider>
        </Wrapper>
      )
    }
    return (
      <View style={styles.container} onLayout={this.onInitialLayoutViewLayout}>
        {this.renderLoading()}
      </View>
    )
  }
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
