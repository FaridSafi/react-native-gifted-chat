import React from 'react';
import {
  Animated,
  InteractionManager,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import ActionSheet from '@exponent/react-native-action-sheet';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import moment from 'moment/min/moment-with-locales.min';

import Actions from './Actions';
import Avatar from './Avatar';
import Bubble from './Bubble';
import MessageImage from './MessageImage';
import MessageText from './MessageText';
import Composer from './Composer';
import Day from './Day';
import InputToolbar from './InputToolbar';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import MessageContainer from './MessageContainer';
import Send from './Send';
import Time from './Time';

// Min and max heights of ToolbarInput and Composer
// Needed for Composer auto grow and ScrollView animation
// TODO move these values to Constants.js (also with used colors #b2b2b2)
const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});
const MAX_COMPOSER_HEIGHT = 100;
const MIN_INPUT_TOOLBAR_HEIGHT = 44;

class GiftedChat extends React.Component {
  constructor(props) {
    super(props);

    // default values
    this._isMounted = false;
    this._keyboardHeight = 0;
    this._bottomOffset = 0;
    this._maxHeight = null;
    this._touchStarted = false;
    this._isFirstLayout = true;
    this._isTypingDisabled = false;
    this._locale = 'en';
    this._messages = [];

    this.state = {
      isInitialized: false, // initialization will calculate maxHeight before rendering the chat
    };

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
    this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
    this.onType = this.onType.bind(this);
    this.onSend = this.onSend.bind(this);
    this.getLocale = this.getLocale.bind(this);

    this.invertibleScrollViewProps = {
      inverted: true,
      keyboardShouldPersistTaps: true,
      onTouchStart: this.onTouchStart,
      onTouchMove: this.onTouchMove,
      onTouchEnd: this.onTouchEnd,
      onKeyboardWillShow: this.onKeyboardWillShow,
      onKeyboardWillHide: this.onKeyboardWillHide,
      onKeyboardDidShow: this.onKeyboardDidShow,
      onKeyboardDidHide: this.onKeyboardDidHide,
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

  getChildContext() {
    return {
      actionSheet: () => this._actionSheetRef,
      getLocale: this.getLocale,
    };
  }

  componentWillMount() {
    this.setIsMounted(true);
    this.initLocale();
    this.initMessages(this.props.messages);
  }

  componentWillUnmount() {
    this.setIsMounted(false);
  }

  componentWillReceiveProps(nextProps = {}) {
    this.initMessages(nextProps.messages);
  }

  initLocale() {
    if (this.props.locale === null || moment.locales().indexOf(this.props.locale) === -1) {
      this.setLocale('en');
    } else {
      this.setLocale(this.props.locale);
    }
  }

  initMessages(messages = []) {
    this.setMessages(messages);
  }

  setLocale(locale) {
    this._locale = locale;
  }

  getLocale() {
    return this._locale;
  }

  setMessages(messages) {
    this._messages = messages;
  }

  getMessages() {
    return this._messages;
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
    if (Platform.OS === 'android') {
      // For android: on-screen keyboard resized main container and has own height.
      // @see https://developer.android.com/training/keyboard-input/visibility.html
      // So for calculate the messages container height ignore keyboard height.
      return 0;
    } else {
      return this._keyboardHeight;
    }
  }

  setBottomOffset(value) {
    this._bottomOffset = value;
  }

  getBottomOffset() {
    return this._bottomOffset;
  }

  setIsFirstLayout(value) {
    this._isFirstLayout = value;
  }

  getIsFirstLayout() {
    return this._isFirstLayout;
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

  // TODO
  // setMinInputToolbarHeight
  getMinInputToolbarHeight() {
    if (this.props.renderAccessory) {
      return MIN_INPUT_TOOLBAR_HEIGHT * 2;
    }
    return MIN_INPUT_TOOLBAR_HEIGHT;
  }

  prepareMessagesContainerHeight(value) {
    if (this.props.isAnimated === true) {
      return new Animated.Value(value);
    }
    return value;
  }

  onKeyboardWillShow(e) {
    this.setIsTypingDisabled(true);
    this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height);
    this.setBottomOffset(this.props.bottomOffset);
    const newMessagesContainerHeight = (this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT))) - this.getKeyboardHeight() + this.getBottomOffset();
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.messagesContainerHeight, {
        toValue: newMessagesContainerHeight,
        duration: 210,
      }).start();
    } else {
      this.setState((previousState) => {
        return {
          messagesContainerHeight: newMessagesContainerHeight,
        };
      });
    }
  }

  onKeyboardWillHide() {
    this.setIsTypingDisabled(true);
    this.setKeyboardHeight(0);
    this.setBottomOffset(0);
    const newMessagesContainerHeight = this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT));
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.messagesContainerHeight, {
        toValue: newMessagesContainerHeight,
        duration: 210,
      }).start();
    } else {
      this.setState((previousState) => {
        return {
          messagesContainerHeight: newMessagesContainerHeight,
        };
      });
    }
  }

  onKeyboardDidShow(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e);
    }
    this.setIsTypingDisabled(false);
  }

  onKeyboardDidHide(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e);
    }
    this.setIsTypingDisabled(false);
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
  onTouchEnd() {
    if (this._touchStarted === true) {
      dismissKeyboard();
    }
    this._touchStarted = false;
  }

  renderMessages() {
    const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
    return (
      <AnimatedView style={{
        height: this.state.messagesContainerHeight,
      }}>
        <MessageContainer
          {...this.props}

          invertibleScrollViewProps={this.invertibleScrollViewProps}

          messages={this.getMessages()}

          ref={component => this._messageContainerRef = component}
        />
        {this.renderChatFooter()}
      </AnimatedView>
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
      }, 200);
    }
  }

  resetInputToolbar() {
    this.setState((previousState) => {
      return {
        text: '',
        composerHeight: MIN_COMPOSER_HEIGHT,
        messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight() - this.getKeyboardHeight() + this.getBottomOffset()),
      };
    });
  }

  calculateInputToolbarHeight(newComposerHeight) {
    return newComposerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT);
  }

  onType(e) {
    if (this.getIsTypingDisabled() === true) {
      return;
    }

    let newComposerHeight = null;
    if (e.nativeEvent && e.nativeEvent.contentSize) {
      newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, e.nativeEvent.contentSize.height));
    } else {
      newComposerHeight = MIN_COMPOSER_HEIGHT;
    }

    const newMessagesContainerHeight = this.getMaxHeight() - this.calculateInputToolbarHeight(newComposerHeight) - this.getKeyboardHeight() + this.getBottomOffset();
    const newText = e.nativeEvent.text;
    this.setState((previousState) => {
      return {
        text: newText,
        composerHeight: newComposerHeight,
        messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
      };
    });
  }

  renderInputToolbar() {
    const inputToolbarProps = {
      ...this.props,
      text: this.state.text,
      composerHeight: Math.max(MIN_COMPOSER_HEIGHT, this.state.composerHeight),
      onChange: this.onType,
      onSend: this.onSend,
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

  renderChatFooter() {
    if (this.props.renderChatFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderChatFooter(footerProps);
    }
    return null;
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
          <View
            style={styles.container}
            onLayout={(e) => {
              // fix an issue when keyboard is dismissing during the initialization
              const layout = e.nativeEvent.layout;
              if (this.getMaxHeight() !== layout.height || this.getIsFirstLayout() === true) {
                this.setMaxHeight(layout.height);
                this.setState({
                  messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight()),
                });
              }
              if (this.getIsFirstLayout() === true) {
                this.setIsFirstLayout(false);
              }
            }}
          >
            {this.renderMessages()}
            {this.renderInputToolbar()}
          </View>
        </ActionSheet>
      );
    }
    return (
      <View
        style={styles.container}
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          this.setMaxHeight(layout.height);
          InteractionManager.runAfterInteractions(() => {
            this.setState({
              isInitialized: true,
              text: '',
              composerHeight: MIN_COMPOSER_HEIGHT,
              messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight()),
            });
          });
        }}
      >
        {this.renderLoading()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

GiftedChat.childContextTypes = {
  actionSheet: React.PropTypes.func,
  getLocale: React.PropTypes.func,
};

GiftedChat.defaultProps = {
  messages: [],
  onSend: () => {
  },
  loadEarlier: false,
  onLoadEarlier: () => {
  },
  locale: null,
  isAnimated: Platform.select({
    ios: true,
    android: false,
  }),
  renderAccessory: null,
  renderActions: null,
  renderAvatar: null,
  renderBubble: null,
  renderFooter: null,
  renderChatFooter: null,
  renderMessageText: null,
  renderMessageImage: null,
  renderComposer: null,
  renderCustomView: null,
  renderDay: null,
  renderInputToolbar: null,
  renderLoadEarlier: null,
  renderLoading: null,
  renderMessage: null,
  renderSend: null,
  renderTime: null,
  user: {},
  bottomOffset: 0,
  isLoadingEarlier: false,
};

GiftedChat.propTypes = {
  messages: React.PropTypes.array,
  onSend: React.PropTypes.func,
  loadEarlier: React.PropTypes.bool,
  onLoadEarlier: React.PropTypes.func,
  locale: React.PropTypes.string,
  isAnimated: React.PropTypes.bool,
  renderAccessory: React.PropTypes.func,
  renderActions: React.PropTypes.func,
  renderAvatar: React.PropTypes.func,
  renderBubble: React.PropTypes.func,
  renderFooter: React.PropTypes.func,
  renderChatFooter: React.PropTypes.func,
  renderMessageText: React.PropTypes.func,
  renderMessageImage: React.PropTypes.func,
  renderComposer: React.PropTypes.func,
  renderCustomView: React.PropTypes.func,
  renderDay: React.PropTypes.func,
  renderInputToolbar: React.PropTypes.func,
  renderLoadEarlier: React.PropTypes.func,
  renderLoading: React.PropTypes.func,
  renderMessage: React.PropTypes.func,
  renderSend: React.PropTypes.func,
  renderTime: React.PropTypes.func,
  user: React.PropTypes.object,
  bottomOffset: React.PropTypes.number,
  isLoadingEarlier: React.PropTypes.bool,
};

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
  Send,
  Time,
};
