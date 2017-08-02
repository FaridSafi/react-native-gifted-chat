import PropTypes from 'prop-types'
import React from 'react'
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'

import ActionSheet from '@expo/react-native-action-sheet'
import moment from 'moment/min/moment-with-locales.min'
import uuid from 'uuid'

import * as utils from './utils'
import Actions from './Actions'
import Avatar from './Avatar'
import Bubble from './Bubble'
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
import GiftedChatInteractionManager from './GiftedChatInteractionManager'

class GiftedChat extends React.Component {
  constructor(props) {
    super(props)

    // default values
    this._isMounted = false
    this._locale = 'en'
    this._messages = []

    this.state = {
      composerHeight: props.mincomposerHeight,
      typingDisabled: false
    }

    this.onSend = this.onSend.bind(this)
    this.getLocale = this.getLocale.bind(this)
    this.onInputSizeChanged = this.onInputSizeChanged.bind(this)
    this.onInputTextChanged = this.onInputTextChanged.bind(this)
  }

  static append(currentMessages = [], messages) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    return messages.concat(currentMessages)
  }

  static prepend(currentMessages = [], messages) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    return currentMessages.concat(messages)
  }

  getChildContext() {
    return {
      actionSheet: () => this._actionSheetRef,
      getLocale: this.getLocale
    }
  }

  componentWillMount() {
    const { messages, text } = this.props
    this.setIsMounted(true)
    this.initLocale()
    this.setMessages(messages || [])
    this.setTextFromProp(text)
  }

  componentWillUnmount() {
    this.setIsMounted(false)
  }

  componentWillReceiveProps(nextProps = {}) {
    const { messages, text } = nextProps
    this.setMessages(messages || [])
    this.setTextFromProp(text)
  }

  initLocale() {
    if (
      this.props.locale === null ||
      moment.locales().indexOf(this.props.locale) === -1
    ) {
      this.setLocale('en')
    } else {
      this.setLocale(this.props.locale)
    }
  }

  setLocale(locale) {
    this._locale = locale
  }

  getLocale() {
    return this._locale
  }

  setTextFromProp(textProp) {
    // Text prop takes precedence over state.
    if (textProp !== undefined && textProp !== this.state.text) {
      this.setState({ text: textProp })
    }
  }

  getTextFromProp(fallback) {
    if (this.props.text === undefined) {
      return fallback
    }
    return this.props.text
  }

  setMessages(messages) {
    this._messages = messages
  }

  getMessages() {
    return this._messages
  }

  setIsTypingDisabled(value) {
    this.setState({
      typingDisabled: value
    })
  }

  getIsTypingDisabled() {
    return this.state.typingDisabled
  }

  setIsMounted(value) {
    this._isMounted = value
  }

  getIsMounted() {
    return this._isMounted
  }

  // TODO
  // setMinInputToolbarHeight
  getMinInputToolbarHeight() {
    return this.props.renderAccessory
      ? this.props.minInputToolbarHeight * 2
      : this.props.minInputToolbarHeight
  }

  calculateInputToolbarHeight(composerHeight) {
    return (
      composerHeight +
      (this.getMinInputToolbarHeight() - this.props.minComposerHeight)
    )
  }

  scrollToBottom(animated = true) {
    if (this._messageContainerRef === null) {
      return
    }
    this._messageContainerRef.scrollToEnd(animated)
  }

  renderMessages() {
    const AnimatedView = this.props.isAnimated === true ? Animated.View : View
    return (
      <AnimatedView style={{ flex: 1 }}>
        <MessageContainer
          {...this.props}
          messages={this.getMessages()}
          ref={component => (this._messageContainerRef = component)}
        />
        {/* TODO: work on chatFooter  */}
        {/* {this.renderChatFooter()}  */}
      </AnimatedView>
    )
  }

  onSend(messages = [], shouldResetInputToolbar = false) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }

    messages = messages.map(message => {
      return {
        ...message,
        user: this.props.user,
        createdAt: new Date(),
        _id: this.props.messageIdGenerator()
      }
    })

    if (shouldResetInputToolbar === true) {
      this.setIsTypingDisabled(true)
      this.resetInputToolbar()
    }

    this.props.onSend(messages)
    this.scrollToBottom()

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

    this.setState({
      text: this.getTextFromProp(''),
      composerHeight: newComposerHeight
    })
  }

  onInputSizeChanged(size) {
    const newComposerHeight = Math.max(
      this.props.minComposerHeight,
      Math.min(this.props.maxComposerHeight, size.height)
    )

    this.setState({
      composerHeight: newComposerHeight
    })
  }

  onInputTextChanged(text) {
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

  renderInputToolbar() {
    const inputToolbarProps = {
      ...this.props,
      text: this.getTextFromProp(this.state.text),
      composerHeight: Math.max(
        this.props.minComposerHeight,
        this.state.composerHeight
      ),
      onSend: this.onSend,
      onInputSizeChanged: this.onInputSizeChanged,
      onTextChanged: this.onInputTextChanged,
      textInputProps: {
        ...this.props.textInputProps,
        ref: textInput => (this.textInput = textInput),
        maxLength: this.getIsTypingDisabled() ? 0 : this.props.maxInputLength
      }
    }
    if (this.getIsTypingDisabled()) {
      inputToolbarProps.textInputProps.maxLength = 0
    }
    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps)
    }
    return <InputToolbar {...inputToolbarProps} />
  }

  renderChatFooter() {
    if (this.props.renderChatFooter) {
      const footerProps = {
        ...this.props
      }
      return this.props.renderChatFooter(footerProps)
    }
    return null
  }

  render() {
    const inputToolbarHeight =
      this.calculateInputToolbarHeight(this.state.composerHeight) + 15
    return (
      <ActionSheet ref={component => (this._actionSheetRef = component)}>
        <ScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
          ref={component => (this._scrollViewRef = component)}
          scrollEnabled={false}
        >
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={inputToolbarHeight} // TODO: Calculate full composer height
            style={styles.container}
          >
            {this.renderMessages()}
            {this.renderInputToolbar()}
          </KeyboardAvoidingView>
        </ScrollView>
      </ActionSheet>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

GiftedChat.childContextTypes = {
  actionSheet: PropTypes.func,
  getLocale: PropTypes.func
}

GiftedChat.defaultProps = {
  messages: [],
  text: undefined,
  placeholder: 'Type a message...',
  messageIdGenerator: () => uuid.v4(),
  user: {},
  onSend: () => { },
  locale: null,
  timeFormat: 'LT',
  dateFormat: 'll',
  isAnimated: Platform.select({
    ios: true,
    android: false
  }),
  loadEarlier: false,
  onLoadEarlier: () => { },
  isLoadingEarlier: false,
  renderLoading: null,
  renderLoadEarlier: null,
  renderAvatar: undefined,
  showUserAvatar: false,
  onPressAvatar: null,
  renderAvatarOnTop: false,
  renderBubble: null,
  onLongPress: null,
  renderMessage: null,
  renderMessageText: null,
  renderMessageImage: null,
  imageProps: {},
  lightboxProps: {},
  renderCustomView: null,
  renderDay: null,
  renderTime: null,
  renderFooter: null,
  renderChatFooter: null,
  renderInputToolbar: null,
  renderComposer: null,
  renderActions: null,
  renderSend: null,
  renderAccessory: null,
  onPressActionButton: null,
  bottomOffset: 0,
  minInputToolbarHeight: 44,
  listViewProps: {},
  keyboardShouldPersistTaps: Platform.select({
    ios: 'never',
    android: 'always'
  }),
  onInputTextChanged: null,
  maxInputLength: null,
  minComposerHeight: Platform.select({
    ios: 33,
    android: 41
  }),
  maxComposerHeight: 100
}

GiftedChat.propTypes = {
  messages: PropTypes.array,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  messageIdGenerator: PropTypes.func,
  user: PropTypes.object,
  onSend: PropTypes.func,
  locale: PropTypes.string,
  timeFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  isAnimated: PropTypes.bool,
  loadEarlier: PropTypes.bool,
  onLoadEarlier: PropTypes.func,
  isLoadingEarlier: PropTypes.bool,
  renderLoading: PropTypes.func,
  renderLoadEarlier: PropTypes.func,
  renderAvatar: PropTypes.func,
  showUserAvatar: PropTypes.bool,
  onPressAvatar: PropTypes.func,
  renderAvatarOnTop: PropTypes.bool,
  renderBubble: PropTypes.func,
  onLongPress: PropTypes.func,
  renderMessage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderMessageImage: PropTypes.func,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
  renderCustomView: PropTypes.func,
  renderDay: PropTypes.func,
  renderTime: PropTypes.func,
  renderFooter: PropTypes.func,
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
  // Min and max heights of ToolbarInput and Composer
  // Needed for Composer auto grow and ScrollView animation
  minComposerHeight: PropTypes.number,
  maxComposerHeight: PropTypes.number
}

export {
  GiftedChat,
  Actions,
  Avatar,
  Bubble,
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
