import React, { Component, PropTypes } from 'react';
import {
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import ParsedText from './ParsedText';
import BubbleImage from './BubbleImage';
import Location from './Location';
import Time from './Time';

export default class Bubble extends Component {
  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  handleBubbleToNext() {
    if (this.props.isSameUser(this.props.currentMessage, this.props.nextMessage) && this.props.isSameDay(this.props.currentMessage, this.props.nextMessage)) {
      return StyleSheet.flatten([styles[this.props.position].containerToNext, this.props.containerToNextStyle[this.props.position]]);
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (this.props.isSameUser(this.props.currentMessage, this.props.previousMessage) && this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
      return StyleSheet.flatten([styles[this.props.position].containerToPrevious, this.props.containerToPreviousStyle[this.props.position]]);
    }
    return null;
  }

  renderParsedText() {
    if (this.props.currentMessage.text) {
      if (this.props.renderParsedText) {
        this.props.renderParsedText(this.props);
      }
      return <ParsedText {...this.props}/>;
    }
    return null;
  }

  renderBubbleImage() {
    if (this.props.currentMessage.image) {
      if (this.props.renderBubbleImage) {
        this.props.renderBubbleImage(this.props);
      }
      return <BubbleImage {...this.props}/>;
    }
    return null;
  }

  renderLocation() {
    if (this.props.currentMessage.location) {
      if (this.props.renderLocation) {
        this.props.renderLocation(this.props);
      }
      return <Location {...this.props}/>;
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      if (this.props.renderTime) {
        return this.props.renderTime(this.props);
      }
      return <Time {...this.props}/>;
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  onLongPress() {
    if (this.props.currentMessage.text) {
      const options = [
        'Copy Text',
        'Cancel',
      ];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(this.props.currentMessage.text);
            break;
        }
      });
    }
  }

  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <View style={[styles[this.props.position].wrapper, this.props.wrapperStyle[this.props.position], this.handleBubbleToNext(), this.handleBubbleToPrevious()]}>
          <TouchableWithoutFeedback
            onLongPress={this.onLongPress}
          >
            <View>
              {this.renderCustomView()}
              {this.renderBubbleImage()}
              {this.renderLocation()}
              {this.renderParsedText()}
              {this.renderTime()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },
    wrapper: {
      borderRadius: 10,
      backgroundColor: '#F1F0F0',
      marginRight: 60,
    },
    containerToNext: {
      borderBottomLeftRadius: 0,
    },
    containerToPrevious: {
      borderTopLeftRadius: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    wrapper: {
      borderRadius: 10,
      backgroundColor: '#0084FF',
      marginLeft: 60,
    },
    containerToNext: {
      borderBottomRightRadius: 0,
    },
    containerToPrevious: {
      borderTopRightRadius: 0,
    },
  }),
};

// required by @exponent/react-native-action-sheet
Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  containerStyle: {},
  wrapperStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},

  renderBubbleImage: null,
  renderParsedText: null,
  renderCustomView: null,
  renderLocation: null,
  renderTime: null,
  isSameUser: () => {},
  isSameDay: () => {},
  position: 'left',
  currentMessage: {
    location: null,
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
};
