import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  InteractionManager,
  Dimensions,
} from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import ActionSheet from '@exponent/react-native-action-sheet';
import dismissKeyboard from 'react-native-dismiss-keyboard';

import Message from './components/Message';
import Composer from './components/Composer';

class GiftedMessenger extends Component {
  constructor(props) {
    super(props);

    // default values
    this._keyboardHeight = 0;
    this._maxHeight = Dimensions.get('window').height;

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
    this.setMessages(this.props.messages.sort((a, b) => {
      return new Date(b.time) - new Date(a.time);
    }));
  }

  componentWillReceiveProps(nextProps) {
    this.setMessages(nextProps.messages);
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
      toValue: (this.getMaxHeight() - (this.state.textInputHeight + (this.props.composerHeightMin - this.props.composerTextInputHeightMin))) - this.getKeyboardHeight(),
      duration: 200,
    }).start();
  }

  onKeyboardWillHide() {
    this.setKeyboardHeight(0);

    Animated.timing(this.state.messagesContainerHeight, {
      toValue: this.getMaxHeight() - (this.state.textInputHeight + (this.props.composerHeightMin - this.props.composerTextInputHeightMin)),
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

          style={[styles.messagesContainer, {
          }]}
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
              onPressAvatar: this.props.onPressAvatar,

              renderDay: this.props.renderDay,
              renderTime: this.props.renderTime,
              renderLocation: this.props.renderLocation,
              renderText: this.props.renderText,
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

  renderComposer() {
    const composerProps = {
      text: this.state.text,
      heightMin: this.props.composerHeightMin,
      textInputHeightMin: this.props.composerTextInputHeightMin,
      textInputHeightMax: this.props.composerTextInputHeightMax,
      textInputHeight: Math.max(this.props.composerTextInputHeightMin, this.state.textInputHeight),
      onType: (e) => {
        const newTextInputHeight = Math.min(this.props.composerTextInputHeightMax, e.nativeEvent.contentSize.height);

        const newMessagesContainerHeight =
          this.state.messagesContainerHeight.__getValue() +
          (this.getMaxHeight()
          - this.state.messagesContainerHeight.__getValue()
          - (Math.max(this.props.composerTextInputHeightMin, newTextInputHeight) + (this.props.composerHeightMin - this.props.composerTextInputHeightMin))
          - this.getKeyboardHeight())
        ;

        this.setState({
          text: e.nativeEvent.text,
          textInputHeight: Math.max(this.props.composerTextInputHeightMin, newTextInputHeight),
          messagesContainerHeight: new Animated.Value(newMessagesContainerHeight),
        });
      },
      onSend: (message) => {
        message.position = 'right';

        this.props.onSend(message);
        const newState = {
          textInputHeight: this.props.composerTextInputHeightMin,
          messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.props.composerHeightMin - this.getKeyboardHeight()),
        };
        if (message.text) {
          newState.text = '';
        }
        this.setState(newState);
        this.scrollToBottom();
      }
    };

    if (this.props.renderComposer) {
      return this.props.renderComposer(composerProps);
    }
    return (
      <Composer {...composerProps}/>
    );
  }

  render() {
    if (this.state.isInitialized === true) {

      // TODO
      // what if I don't want action sheet?
      return (
        <ActionSheet ref={component => this._actionSheetRef = component}>
          <View style={styles.container}>
            {this.renderMessages()}
            {this.renderComposer()}
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
              textInputHeight: this.props.composerTextInputHeightMin,
              messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.props.composerHeightMin),
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

  onPressAvatar: null,

  renderMessage: null,
  renderComposer: null,
  renderAvatar: null,

  renderDay: null,
  renderTime: null,
  renderLocation: null,
  renderText: null,

  // TODO
  // render components of composer

  composerHeightMin: 55,
  composerTextInputHeightMin: 35,
  composerTextInputHeightMax: 100,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    // flex: 1,
    // backgroundColor: 'red',
  },
});

export {GiftedMessenger, Message, Composer};
