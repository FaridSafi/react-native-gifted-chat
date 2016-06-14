import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import BubbleText from './BubbleText';
import Location from './Location';
import Time from './Time';

class Bubble extends Component {

  handleBubbleToNext() {
    if (this.props.isSameUser(this.props, this.props.nextMessage) && this.props.isSameDay(this.props, this.props.nextMessage)) {
      return this.props.customStyles.Bubble[this.props.position].containerToNext;
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (this.props.isSameUser(this.props, this.props.previousMessage) && this.props.isSameDay(this.props, this.props.previousMessage)) {
      return this.props.customStyles.Bubble[this.props.position].containerToPrevious;
    }
    return null;
  }

  renderBubbleText() {
    if (this.props.text) {
      if (this.props.renderBubbleText) {
        this.props.renderBubbleText(this.props);
      }
      return <BubbleText {...this.props}/>;
    }
    return null;
  }

  renderLocation() {
    if (this.props.location) {
      if (this.props.renderLocation) {
        this.props.renderLocation(this.props);
      }
      return <Location {...this.props}/>;
    }
    return null;
  }

  renderTime() {
    if (this.props.time) {
      if (this.props.renderTime) {
        return this.props.renderTime(this.props);
      }
      return <Time {...this.props}/>;
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      // const customViewProps = {};
      // for (let key in this.props) {
      //   if (this.props.hasOwnProperty[key]) {
      //     if (key.indexOf('render') !== 0) {
      //       customViewProps[key] = this.props[key];
      //     }
      //   }
      // }
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  render() {
    return (
      <View style={[this.props.customStyles.Bubble[this.props.position].container, this.handleBubbleToNext(), this.handleBubbleToPrevious()]}>
        {this.renderLocation()}
        {this.renderBubbleText()}
        {this.renderCustomView()}
        {this.renderTime()}
      </View>
    );
  }
}

Bubble.defaultProps = {
  'locale': null,
  'customStyles': {},

  'isSameUser': () => {},
  'isSameDay': () => {},

  'location': null,
  'position': 'left',
  'text': null,
  'time': null,

  'nextMessage': null,
  'previousMessage': null,

  'renderBubbleText': null,
  'renderCustomView': null,
  'renderLocation': null,
  'renderTime': null,
};

export default Bubble;

// clean
