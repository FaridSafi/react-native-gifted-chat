import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  InteractionManager,
  Dimensions,
} from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import md5 from 'md5';

import Message from './components/Message';
import Composer from './components/Composer';

class GiftedMessenger extends Component {
  constructor(props) {
    super(props);

    // default values
    this._keyboardHeight = 0;
    this._maxHeight = Dimensions.get('window').height;

    this.state = {
      isInitialized: false,
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

  renderMessages() {
    return (
      <Animated.View style={{
        height: this.state.messagesContainerHeight,
      }}>
        <InvertibleScrollView
          inverted={true}

          style={[styles.messagesContainer, {
          }]}
          onKeyboardWillShow={this.onKeyboardWillShow.bind(this)}
          onKeyboardWillHide={this.onKeyboardWillHide.bind(this)}

          ref={(r) => {
            this._scrollView = r;
          }}
        >
          {this.props.messages.map((message, index) => {
            const messageProps = {
              ...message,
              previousMessage: this.props.messages[index - 1],
              nextMessage: this.props.messages[index + 1],
            };

            const key = md5(JSON.stringify(message));
            return (
              <View key={key}>
                {this.props.renderMessage(messageProps)}
              </View>
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
      onSend: () => {
        this.props.onSend({
          text: this.state.text,
        });
        this.setState({
          text: '',
          textInputHeight: this.props.composerTextInputHeightMin,
          messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.props.composerHeightMin - this.getKeyboardHeight()),
        });
        this.scrollToBottom();
      }
    };

    return this.props.renderComposer(composerProps);
  }

  render() {
    console.log('render gifted messenger');
    if (this.state.isInitialized === true) {
      return (
        <View style={styles.container}>
          {this.renderMessages()}
          {this.renderComposer()}
        </View>
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

  renderMessage: (props) => <Message {...props}/>,
  renderComposer: (props) => <Composer {...props}/>,

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

export default GiftedMessenger;
