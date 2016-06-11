import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import Message from './components/Message';
import Composer from './components/Composer';
import Time from './components/Time';

import InvertibleScrollView from 'react-native-invertible-scroll-view';

class GiftedMessenger extends Component {
  constructor(props) {
    super(props);

    // TODO
    // try to calculate maxHeight automatically

    // TODO
    // 35 and 10 as props

    const textInputContainerHeight = 55; // 55 = 35(min height) + 10(marginBottom) + 10(marginTop)

    // TODO getter & setter for listViewMaxHeight
    // TODO
    // is listViewMaxHeight still useful?
    this.listViewMaxHeight = this.props.maxHeight - textInputContainerHeight;


    this._keyboardHeight = 0;

    this.state = {
      text: '',
      textInputHeight: 35,
      messagesContainerHeight: new Animated.Value(this.listViewMaxHeight),
    };
  }

  componentDidMount() {
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
      toValue: (this.props.maxHeight - (this.state.textInputHeight + 10 + 10)) - this.getKeyboardHeight(),
      duration: 200,
    }).start();
  }

  onKeyboardWillHide() {
    this.setKeyboardHeight(0);

    Animated.timing(this.state.messagesContainerHeight, {
      toValue: this.props.maxHeight - (this.state.textInputHeight + 10 + 10),
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
            return (
              <this.props.components.Message
                {...message}
                key={'message'+index}
              />
            );
          })}
        </InvertibleScrollView>
      </Animated.View>
    );
  }

  renderComposer() {
    return (
      <this.props.components.Composer
        text={this.state.text}
        textInputHeight={Math.max(35, this.state.textInputHeight)}

        onType={(e) => {
          const newTextInputHeight = Math.min(100, e.nativeEvent.contentSize.height);

          const newMessagesContainerHeight =
            this.state.messagesContainerHeight.__getValue() +
            (this.props.maxHeight
            - this.state.messagesContainerHeight.__getValue()
            - (Math.max(35, newTextInputHeight) + 10 + 10)
            - this.getKeyboardHeight())
          ;

          this.setState({
            text: e.nativeEvent.text,
            textInputHeight: Math.max(35, newTextInputHeight),
            messagesContainerHeight: new Animated.Value(newMessagesContainerHeight),
          });
        }}
        onSend={() => {
          this.props.onSend({
            text: this.state.text,
          });
          this.setState({
            text: '',
            textInputHeight: 35,
            messagesContainerHeight: new Animated.Value(this.listViewMaxHeight - this.getKeyboardHeight()),
          });

          this.scrollToBottom();
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMessages()}
        {this.renderComposer()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    // flex: 1,
    // backgroundColor: 'red',
  },
});

export {
  GiftedMessenger,
  Message,
  Composer,
  Time,
};
