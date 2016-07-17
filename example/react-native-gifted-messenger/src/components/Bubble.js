import React, { Component, PropTypes } from 'react';
import {
  Clipboard,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import ParsedText from './ParsedText';
import BubbleImage from './BubbleImage';
import Location from './Location';
import Time from './Time';

class Bubble extends Component {
  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }
  // required by @exponent/react-native-action-sheet
  static contextTypes = {
    actionSheet: PropTypes.func,
  };

  handleBubbleToNext() {
    if (this.props.isSameUser(this.props.currentMessage, this.props.nextMessage) && this.props.isSameDay(this.props.currentMessage, this.props.nextMessage)) {
      return this.props.customStyles.Bubble[this.props.position].containerToNext;
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (this.props.isSameUser(this.props.currentMessage, this.props.previousMessage) && this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
      return this.props.customStyles.Bubble[this.props.position].containerToPrevious;
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

  // TODO issue this is not working
  onLongPress() {
    if (this.props.text) {
      let options = [
        'Copy Text',
        'Cancel',
      ];
      let cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(this.props.text);
            break;
        }
      });
    }
  }

  render() {
    return (
      <View style={[this.props.customStyles.Bubble[this.props.position].container]}>
        <View style={[this.props.customStyles.Bubble[this.props.position].wrapper, this.handleBubbleToNext(), this.handleBubbleToPrevious()]}>
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

Bubble.defaultProps = {
  customStyles: {},
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

export default Bubble;
