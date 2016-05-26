import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';

import Message from './components/Message';
import Composer from './components/Composer';

const KEYBOARD_VELOCITY = 27;

// TODO
// use maxHeight, do not use setinterval

class GiftedMessenger extends Component {
  constructor() {
    super();

    this._scrollY = 0;
    this._contentHeight = 0;
    this._scrollViewHeight = 0;
    this._composerHeight = 44;
    this._onKeyboardWillShowInterval = null;
    this._onKeyboardWillHideInterval = null;

    this.state = {
      keyboardHeight: 0,
      contentInsetTop: 0,
      contentInsetBottom: 0,
      marginTop: 0,
      composerBottomOffset: new Animated.Value(0),
    };
  }
  componentWillUnmount() {
    if (this._onKeyboardWillShowInterval) {
      clearInterval(this._onKeyboardWillShowInterval);
    }
    if (this._onKeyboardWillHideInterval) {
      clearInterval(this._onKeyboardWillHideInterval);
    }
  }
  _isContentSmallerThanHeight() {
    return this._contentHeight > this._scrollViewHeight;
  }
  onLayout(e) {
    this._scrollViewHeight = e.nativeEvent.layout.height;
  }
  // TODO
  // doesnt scroll when append message
  onContentSizeChange(contentWidth, contentHeight) {
    requestAnimationFrame(() => {
      this._contentHeight = contentHeight;
      if (this.isContentBiggerThanHeight()) {
        this._scrollView.scrollTo({
          y: contentHeight - this._scrollViewHeight,
          animated: false,
        });

        this._scrollY = contentHeight - this._scrollViewHeight;
      }
    });
  }
  onScroll(e) {
    // TODO move contentInsetTop to this._ instead of state maybe
    this._scrollY = e.nativeEvent.contentOffset.y + this.state.contentInsetTop;
  }
  isContentBiggerThanHeight() {
    return this._contentHeight > this._scrollViewHeight;
  }
  onKeyboardWillShow(e) {
    if (this._onKeyboardWillShowInterval) return;

    let stickToTop = false;
    if (this._scrollY < this.state.keyboardHeight) {
      stickToTop = true;
    }

    // TODO move to function
    Animated.timing(this.state.composerBottomOffset, {
      toValue: e.endCoordinates.height,
      duration: 200,
    }).start();

    this._onKeyboardWillShowInterval = setInterval(() => {
      if (this.state.keyboardHeight < e.endCoordinates.height) {
        const keyboardHeight = (this.state.keyboardHeight + KEYBOARD_VELOCITY > e.endCoordinates.height ? e.endCoordinates.height : this.state.keyboardHeight + KEYBOARD_VELOCITY);
        if (this.isContentBiggerThanHeight()) {
          if (stickToTop === true) {
            this.setState({
              keyboardHeight: keyboardHeight,
              // contentInsetTop: keyboardHeight,
              contentInsetBottom: keyboardHeight,
              // marginTop: keyboardHeight * -1,
            })
          } else {
            this.setState({
              keyboardHeight: keyboardHeight,
              contentInsetTop: keyboardHeight,
              contentInsetBottom: keyboardHeight,
              marginTop: keyboardHeight * -1,
            })
          }
        } else {
          this.setState({
            keyboardHeight: keyboardHeight,
            contentInsetTop: 0,
            contentInsetBottom: keyboardHeight,
            marginTop: 0,
          })
        }
      } else {
        clearInterval(this._onKeyboardWillShowInterval);
        this._onKeyboardWillShowInterval = null;
      }
    }, 1000 / 30);
  }
  onKeyboardWillHide(e) {
    if (this._onKeyboardWillHideInterval) return;
    // TODO rename state.keyboardheight to something else, related to current offset

    let stickToTop = false;
    if (this._scrollY < this.state.keyboardHeight) {
      stickToTop = true;
    }

    // TODO move to function
    Animated.timing(this.state.composerBottomOffset, {
      toValue: 0,
      duration: 200,
    }).start();

    this._onKeyboardWillHideInterval = setInterval(() => {
      if (this.state.keyboardHeight > 0) {
        const keyboardHeight = (this.state.keyboardHeight - KEYBOARD_VELOCITY < 0 ? 0 : this.state.keyboardHeight - KEYBOARD_VELOCITY);
        if (this.isContentBiggerThanHeight()) {
          if (stickToTop === true) {
            this.setState({
              keyboardHeight: keyboardHeight,
              contentInsetBottom: keyboardHeight,
            });
          } else {
            this.setState({
              keyboardHeight: keyboardHeight,
              contentInsetTop: keyboardHeight,
              contentInsetBottom: keyboardHeight,
              marginTop: keyboardHeight * -1,
            });
          }
        } else {
          this.setState({
            keyboardHeight: keyboardHeight,
            contentInsetTop: 0,
            contentInsetBottom: keyboardHeight,
            marginTop: 0,
          });
        }
      } else {
        clearInterval(this._onKeyboardWillHideInterval);
        this._onKeyboardWillHideInterval = null;
      }
    }, 1000 / 30);
  }
  render() {
    return (
      <View style={styles.container}>

        <ScrollView
          ref={(c) => this._scrollView = c}
          onLayout={this.onLayout.bind(this)}
          onContentSizeChange={this.onContentSizeChange.bind(this)}
          onKeyboardWillShow={this.onKeyboardWillShow.bind(this)}
          onKeyboardWillHide={this.onKeyboardWillHide.bind(this)}
          onScroll={this.onScroll.bind(this)}
          scrollEventThrottle={500}

          automaticallyAdjustContentInsets={false}
          contentInset={{
            top: this.state.contentInsetTop,
            bottom: this.state.contentInsetBottom,
          }}
          style={{
            marginTop: this.state.marginTop,
            marginBottom: this._composerHeight,
          }}
        >
          {this.props.messages.map((message) => {
            return message();
          })}
        </ScrollView>

        <Animated.View style={{
          position: 'absolute',
          bottom: this.state.composerBottomOffset,
          left: 0,
          right: 0,
          height: this._composerHeight,
        }}>
          <Composer />
        </Animated.View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export {
  GiftedMessenger,
  Message,
};
