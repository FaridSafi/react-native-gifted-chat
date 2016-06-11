import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  InteractionManager,
  Dimensions,
} from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import Message from './components/Message';
import Composer from './components/Composer';
import Time from './components/Time';

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

  componentDidMount() {
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
      toValue: (this.getMaxHeight() - (this.state.textInputHeight + (this.props.composerMinimumHeight - this.props.composerTextInputMinimumHeight))) - this.getKeyboardHeight(),
      duration: 200,
    }).start();
  }

  onKeyboardWillHide() {
    this.setKeyboardHeight(0);

    Animated.timing(this.state.messagesContainerHeight, {
      toValue: this.getMaxHeight() - (this.state.textInputHeight + (this.props.composerMinimumHeight - this.props.composerTextInputMinimumHeight)),
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
          style={[styles.messagesContainer, {
          }]}
          onKeyboardWillShow={this.onKeyboardWillShow.bind(this)}
          onKeyboardWillHide={this.onKeyboardWillHide.bind(this)}

          ref={(r) => {
            this._scrollView = r;
          }}

          inverted={true}
        >
          {this.props.messages.map((message, index) => {
            const messageProps = {
              ...message,
              key: 'message_'+index,
            };
            return this.props.renderMessage(messageProps);
          })}
        </InvertibleScrollView>
      </Animated.View>
    );
  }

  renderComposer() {
    const composerProps = {
      text: this.state.text,
      textInputHeight: Math.max(this.props.composerTextInputMinimumHeight, this.state.textInputHeight),
      onType: (e) => {
        const newTextInputHeight = Math.min(this.props.composerTextInputMaximumHeight, e.nativeEvent.contentSize.height);

        const newMessagesContainerHeight =
          this.state.messagesContainerHeight.__getValue() +
          (this.getMaxHeight()
          - this.state.messagesContainerHeight.__getValue()
          - (Math.max(this.props.composerTextInputMinimumHeight, newTextInputHeight) + (this.props.composerMinimumHeight - this.props.composerTextInputMinimumHeight))
          - this.getKeyboardHeight())
        ;

        this.setState({
          text: e.nativeEvent.text,
          textInputHeight: Math.max(this.props.composerTextInputMinimumHeight, newTextInputHeight),
          messagesContainerHeight: new Animated.Value(newMessagesContainerHeight),
        });
      },
      onSend: () => {
        this.props.onSend({
          text: this.state.text,
        });
        this.setState({
          text: '',
          textInputHeight: this.props.composerTextInputMinimumHeight,
          messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.props.composerMinimumHeight - this.getKeyboardHeight()),
        });
        this.scrollToBottom();
      }
    };

    return this.props.renderComposer(composerProps);
  }

  render() {
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
              textInputHeight: this.props.composerTextInputMinimumHeight,
              messagesContainerHeight: new Animated.Value(this.getMaxHeight() - this.props.composerMinimumHeight),
            });
          });
        }}
      />
    );
  }
}

GiftedMessenger.defaultProps = {
  renderMessage: (props) => <Message {...props }/>,
  renderComposer: (props) => <Composer {...props }/>,
  renderTime: (props) => <Time {...props }/>,

  composerMinimumHeight: 55,
  composerTextInputMinimumHeight: 35,
  composerTextInputMaximumHeight: 100,

  messages: [],
  onSend: () => {},

  // textInputMinimalHeight: 35,
  // composer: 35,


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
