import React, { Component, PropTypes } from 'react';
import {
  Animated,
  View,
  InteractionManager,
  Dimensions,
} from 'react-native';
import moment from 'moment/min/moment-with-locales.min';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import ActionSheet from '@exponent/react-native-action-sheet';
import dismissKeyboard from 'react-native-dismiss-keyboard';

import Actions from './components/Actions';
import Avatar from './components/Avatar';
import Bubble from './components/Bubble';
import BubbleText from './components/BubbleText';
import Composer from './components/Composer';
import Day from './components/Day';
import InputToolbar from './components/InputToolbar';
import Location from './components/Location';
import Message from './components/Message';
import Send from './components/Send';
import Time from './components/Time';

import DefaultStyles from './DefaultStyles';


class GiftedMessenger extends Component {
  constructor(props) {
    super(props);

    // default values
    this._keyboardHeight = 0;
    this._maxHeight = Dimensions.get('window').height;

    // TODO
    // check if missing default values (starting by _)

    this.state = {
      isInitialized: false, // needed to calculate the maxHeight before rendering the chat
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

  static append(currentMessages, messages) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return messages.concat(currentMessages);
  }

  static prepend(currentMessages, messages) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return currentMessages.concat(messages);
  }

  componentWillMount() {
    this.initLocale();
    this.initCustomStyles();
    this.initMessages(this.props.messages, true);
  }

  componentWillReceiveProps(nextProps) {
    this.initMessages(nextProps.messages, false);
  }

  initLocale() {
    if (this.props.locale === 'en' || moment.locales().indexOf(this.props.locale) === -1) {
      this.setLocale('en');
    } else {
      this.setLocale(this.props.locale);
    }
  }

  initCustomStyles() {
    this.setCustomStyles(this.props.customStyles);
  }

  initMessages(messages, sort = false) {
    if (sort === true) {
      this.setMessages(messages.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
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
    return this._keyboardHeight;
  }

  onKeyboardWillShow(e) {
    this.setKeyboardHeight(e.endCoordinates.height);

    Animated.timing(this.state.messagesContainerHeight, {
      toValue: (this.getMaxHeight() - (this.state.composerHeight + (this.props.inputToolbarHeightMin - this.props.inputToolbarComposerHeightMin))) - this.getKeyboardHeight(),
      duration: 200,
    }).start();
  }

  onKeyboardWillHide() {
    this.setKeyboardHeight(0);

    Animated.timing(this.state.messagesContainerHeight, {
      toValue: this.getMaxHeight() - (this.state.composerHeight + (this.props.inputToolbarHeightMin - this.props.inputToolbarComposerHeightMin)),
      duration: 200,
    }).start();
  }

  scrollToBottom(animated = true) {
    this._scrollView.scrollTo({
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
        <InvertibleScrollView
          inverted={true}
          keyboardShouldPersistTaps={true}

          onTouchStart={this.onTouchStart.bind(this)}
          onTouchMove={this.onTouchMove.bind(this)}
          onTouchEnd={this.onTouchEnd.bind(this)}

          onKeyboardWillShow={this.onKeyboardWillShow.bind(this)}
          onKeyboardWillHide={this.onKeyboardWillHide.bind(this)}

          ref={(r) => {
            this._scrollView = r;
          }}

          {...this.props}
        >
          {this.getMessages().map((message, index) => {
            const messageProps = {
              ...message,
              previousMessage: this.getMessages()[index + 1] ? this.getMessages()[index + 1] : null,
              nextMessage: this.getMessages()[index - 1] ? this.getMessages()[index - 1] : null,

              renderAvatar: this.props.renderAvatar,
              renderDay: this.props.renderDay,
              renderTime: this.props.renderTime,
              renderLocation: this.props.renderLocation,
              renderBubble: this.props.renderBubble,
              renderBubbleText: this.props.renderBubbleText,

              customStyles: this.getCustomStyles(),
              locale: this.getLocale(),
            };

            if (!messageProps.key) {
              console.warn('GiftedMessenger: key is missing for message', JSON.stringify(message));
            }

            if (this.props.renderMessage) {
              return this.props.renderMessage(messageProps);
            }
            return (
              <Message {...messageProps}/>
            );
          })}
        </InvertibleScrollView>
      </Animated.View>
    );
  }

  renderInputToolbar() {
    const inputToolbarProps = {

      renderActions: this.props.renderActions,
      renderSend: this.props.renderSend,
      renderComposer: this.props.renderComposer,

      text: this.state.text,

      heightMin: this.props.inputToolbarHeightMin,
      composerHeightMin: this.props.inputToolbarComposerHeightMin,
      composerHeightMax: this.props.inputToolbarComposerHeightMax,
      composerHeight: Math.max(this.props.inputToolbarComposerHeightMin, this.state.composerHeight),
      onChange: (e) => {
        const newComposerHeight = Math.min(this.props.inputToolbarComposerHeightMax, e.nativeEvent.contentSize.height);

        const newMessagesContainerHeight =
          this.state.messagesContainerHeight.__getValue() +
          (this.getMaxHeight()
          - this.state.messagesContainerHeight.__getValue()
          - (Math.max(this.props.inputToolbarComposerHeightMin, newComposerHeight) + (this.props.inputToolbarHeightMin - this.props.inputToolbarComposerHeightMin))
          - this.getKeyboardHeight())
        ;

        this.setState({
          text: e.nativeEvent.text,
          composerHeight: Math.max(this.props.inputToolbarComposerHeightMin, newComposerHeight),
          messagesContainerHeight: new Animated.Value(newMessagesContainerHeight),
        });
      },
      onSend: (message) => {
        message.position = 'right';

        this.props.onSend(message);
        const newState = {
          composerHeight: this.props.inputToolbarComposerHeightMin,
          messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.props.inputToolbarHeightMin - this.getKeyboardHeight()),
        };
        if (message.text) {
          newState.text = '';
        }
        this.setState(newState);
        this.scrollToBottom();
      },

      customStyles: this.getCustomStyles(),
      locale: this.getLocale(),
    };

    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps);
    }
    return (
      <InputToolbar {...inputToolbarProps}/>
    );
  }

  render() {
    if (this.state.isInitialized === true) {

      // TODO
      // what if I don't want action sheet?
      // maybe an option?
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
              composerHeight: this.props.inputToolbarComposerHeightMin,
              messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.props.inputToolbarHeightMin),
            });
          });
        }}
      />
    );
  }
}

GiftedMessenger.defaultProps = {
  messages: [],
  onSend: () => {},

  locale: null,
  customStyles: DefaultStyles,

  // Message related
  // TODO re order like in the code
  renderMessage: null,
  renderDay: null,
  renderBubble: null,
  renderBubbleText: null,
  renderAvatar: null,
  renderTime: null,
  renderLocation: null,

  // InputToolbar related
  renderActions: null,
  renderSend: null,
  renderComposer: null,


  inputToolbarHeightMin: 55,
  inputToolbarComposerHeightMin: 35,
  inputToolbarComposerHeightMax: 100,
};

export {
  GiftedMessenger,
  Actions,
  Avatar,
  Bubble,
  BubbleText,
  Composer,
  Day,
  InputToolbar,
  Location,
  Message,
  Send,
  DefaultStyles,
  Time,
};
