import React, { Component, PropTypes } from 'react';
import {
  Animated,
  View,
  InteractionManager,
} from 'react-native';

import ActionSheet from '@exponent/react-native-action-sheet';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import moment from 'moment/min/moment-with-locales.min';
import md5 from 'md5';

import Actions from './components/Actions';
import Avatar from './components/Avatar';
import Bubble from './components/Bubble';
import BubbleImage from './components/BubbleImage';
import ParsedText from './components/ParsedText';
import Composer from './components/Composer';
import Day from './components/Day';
import InputToolbar from './components/InputToolbar';
import LoadEarlier from './components/LoadEarlier';
import Location from './components/Location';
import Message from './components/Message';
import MessageContainer from './components/MessageContainer';
import Send from './components/Send';
import Time from './components/Time';
import DefaultStyles from './DefaultStyles';

// TODO
// onPressUrl
// onPressPhone
// onPressEmail

class GiftedMessenger extends Component {
  constructor(props) {
    super(props);

    // default values
    this._isMounted = false;
    this._keyboardHeight = 0;
    this._maxHeight = null;
    this._touchStarted = false;
    this._isTypingDisabled = false;

    this.state = {
      isInitialized: false, // initialization will calculate maxHeight before rendering the chat
    };
  }

  // required by @exponent/react-native-action-sheet
  static childContextTypes = {
    actionSheet: PropTypes.func,
  };

  // required by @exponent/react-native-action-sheet
  getChildContext() {
    return {
      actionSheet: () => this._actionSheetRef,
    };
  }

  static append(currentMessages = [], messages) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return messages.concat(currentMessages);
  }

  static prepend(currentMessages = [], messages) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return currentMessages.concat(messages);
  }

  // static update(currentMessages = [], options) {
  //   if (!Array.isArray(options)) {
  //     options = [options];
  //   }
  //
  //   return currentMessages.map((message) => {
  //     for (let i = 0; i < options.length; i++) {
  //       const {find, set} = options;
  //       if () {
  //         return
  //       }
  //     }
  //     return message;
  //   });
  // }

  componentWillMount() {
    this.setIsMounted(true);
    this.initLocale();
    this.initCustomStyles();
    this.initMessages(this.props.messages, true);
  }

  componentWillUnmount() {
    this.setIsMounted(false);
  }

  componentWillReceiveProps(nextProps) {
    this.initMessages(nextProps.messages, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  initLocale() {
    if (this.props.locale === null || moment.locales().indexOf(this.props.locale) === -1) {
      this.setLocale('en');
    } else {
      this.setLocale(this.props.locale);
    }
  }

  initCustomStyles() {
    if (this.props.customStyles) {
      this.setCustomStyles(this.props.customStyles);
    } else {
      this.setCustomStyles(DefaultStyles);
    }
  }

  initMessages(messages = [], sort = false) {
    if (sort === true) {
      this.setMessages(messages.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }));
    } else {
      this.setMessages(messages);
    }
  }

  setLocale(locale) {
    this._locale = locale;
  }

  getLocale() {
    return this._locale;
  }

  setCustomStyles(customStyles) {
    this._customStyles = customStyles;
  }

  getCustomStyles() {
    return this._customStyles;
  }

  setMessages(messages) {
    this._messages = messages;
    this.setMessagesHash(md5(JSON.stringify(messages)));
  }

  getMessages() {
    return this._messages;
  }

  setMessagesHash(messagesHash) {
    this._messagesHash = messagesHash;
  }

  getMessagesHash() {
    return this._messagesHash;
  }

  setMaxHeight(height) {
    this._maxHeight = height;
  }

  getMaxHeight() {
    return this._maxHeight;
  }

  setKeyboardHeight(height) {
    this._keyboardHeight = height;
  }

  getKeyboardHeight() {
    return this._keyboardHeight;
  }

  setIsTypingDisabled(value) {
    this._isTypingDisabled = value;
  }

  getIsTypingDisabled() {
    return this._isTypingDisabled;
  }

  setIsMounted(value) {
    this._isMounted = value;
  }

  getIsMounted() {
    return this._isMounted;
  }

  onKeyboardWillShow(e) {
    this.setKeyboardHeight(e.endCoordinates.height);
    Animated.timing(this.state.messagesContainerHeight, {
      toValue: (this.getMaxHeight() - (this.state.composerHeight + (this.getCustomStyles().minInputToolbarHeight - this.getCustomStyles().minComposerHeight))) - this.getKeyboardHeight(),
      duration: 200,
    }).start();
  }

  onKeyboardWillHide() {
    this.setKeyboardHeight(0);
    Animated.timing(this.state.messagesContainerHeight, {
      toValue: this.getMaxHeight() - (this.state.composerHeight + (this.getCustomStyles().minInputToolbarHeight - this.getCustomStyles().minComposerHeight)),
      duration: 200,
    }).start();
  }

  scrollToBottom(animated = true) {
    this._messageContainerRef.scrollTo({
      y: 0,
      animated,
    });
  }

  onTouchStart() {
    this._touchStarted = true;
  }

  onTouchMove() {
    this._touchStarted = false;
  }

  // handle Tap event to dismiss keyboard
  // TODO test android
  onTouchEnd() {
    if (this._touchStarted === true) {
      dismissKeyboard();
    }
    this._touchStarted = false;
  }

  renderMessages() {
    return (
      <Animated.View style={{
        height: this.state.messagesContainerHeight,
      }}>
        <MessageContainer
          {...this.props}

          invertibleScrollViewProps={{
            inverted: true,
            keyboardShouldPersistTaps: true,
            onTouchStart: this.onTouchStart.bind(this),
            onTouchMove: this.onTouchMove.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this),
            onKeyboardWillShow: this.onKeyboardWillShow.bind(this),
            onKeyboardWillHide: this.onKeyboardWillHide.bind(this),
          }}

          messages={this.getMessages()}
          messagesHash={this.getMessagesHash()}
          customStyles={this.getCustomStyles()}
          locale={this.getLocale()}

          ref={component => this._messageContainerRef = component}
        />
      </Animated.View>
    );
  }

  onSend(messages = [], shouldResetInputToolbar = false) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }

    messages = messages.map((message) => {
      return {
        ...message,
        user: this.props.user,
        createdAt: new Date(),
        _id: 'temp-id-' + Math.round(Math.random() * 1000000),
      };
    });

    if (shouldResetInputToolbar === true) {
      this.setIsTypingDisabled(true);
      this.resetInputToolbar();
    }

    this.props.onSend(messages);
    this.scrollToBottom();

    if (shouldResetInputToolbar === true) {
      setTimeout(() => {
        if (this.getIsMounted() === true) {
          this.setIsTypingDisabled(false);
        }
      }, 100);
    }
  }

  resetInputToolbar() {
    this.setState({
      text: '',
      composerHeight: this.getCustomStyles().minComposerHeight,
      messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.getCustomStyles().minInputToolbarHeight - this.getKeyboardHeight()),
    });
  }

  calculateInputToolbarHeight(newComposerHeight) {
    return newComposerHeight + (this.getCustomStyles().minInputToolbarHeight - this.getCustomStyles().minComposerHeight);
  }

  onType(e) {
    if (this.getIsTypingDisabled() === true) {
      return;
    }
    const newComposerHeight = Math.max(this.getCustomStyles().minComposerHeight, Math.min(this.getCustomStyles().maxComposerHeight, e.nativeEvent.contentSize.height));
    const newMessagesContainerHeight = this.getMaxHeight() - this.calculateInputToolbarHeight(newComposerHeight) - this.getKeyboardHeight();
    this.setState({
      text: e.nativeEvent.text,
      composerHeight: newComposerHeight,
      messagesContainerHeight: new Animated.Value(newMessagesContainerHeight),
    });
  }

  renderInputToolbar() {
    const inputToolbarProps = {
      ...this.props,
      text: this.state.text,
      composerHeight: Math.max(this.getCustomStyles().minComposerHeight, this.state.composerHeight),
      onChange: this.onType.bind(this),
      onSend: this.onSend.bind(this),
      customStyles: this.getCustomStyles(),
      locale: this.getLocale(),
    };

    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps);
    }
    return (
      <InputToolbar
        {...inputToolbarProps}
      />
    );
  }

  renderLoading() {
    if (this.props.renderLoading) {
      return this.props.renderLoading();
    }
    return null;
  }

  render() {
    if (this.state.isInitialized === true) {
      return (
        <ActionSheet ref={component => this._actionSheetRef = component}>
          <View style={{flex: 1}}>
            {this.renderMessages()}
            {this.renderInputToolbar()}
          </View>
        </ActionSheet>
      );
    }
    return (
      <View
        style={{flex: 1}}
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          this.setMaxHeight(layout.height);
          InteractionManager.runAfterInteractions(() => {
            this.setState({
              isInitialized: true,
              text: '',
              composerHeight: this.getCustomStyles().minComposerHeight,
              messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.getCustomStyles().minInputToolbarHeight),
            });
          });
        }}
      >
        {this.renderLoading()}
      </View>
    );
  }
}

GiftedMessenger.defaultProps = {
  messages: [],
  onSend: () => {},
  loadEarlier: false,
  onLoadEarlier: () => {},
  locale: null,
  // TODO TEST:
  // customStyles: {},
  customStyles: null, // initCustomStyles will check null value
  renderActions: null,
  renderAvatar: null,
  renderBubble: null,
  renderParsedText: null,
  renderBubbleImage: null,
  renderComposer: null,
  renderCustomView: null,
  renderDay: null,
  renderInputToolbar: null,
  renderLoading: null,
  renderLocation: null,
  renderMessage: null,
  renderSend: null,
  renderTime: null,
  user: {}, // mandatory
};

export {
  GiftedMessenger,
  Actions,
  Avatar,
  Bubble,
  BubbleImage,
  ParsedText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Location,
  Message,
  Send,
  Time,
  DefaultStyles,
};
