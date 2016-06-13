import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import moment from 'moment';

import Time from './Time';
import Location from './Location';
import BubbleText from './BubbleText';

class Bubble extends Component {

  handleBubbleCorners() {
    let cornerStyles = {};
    if (this.props.isSameUser(this.props, this.props.nextMessage) && this.props.isSameDay(this.props, this.props.nextMessage)) {
      cornerStyles = {
        ...cornerStyles,
        ...this.props.theme.Bubble[this.props.position].containerToNext,
      };
    }
    if (this.props.isSameUser(this.props, this.props.previousMessage) && this.props.isSameDay(this.props, this.props.previousMessage)) {
      cornerStyles = {
        ...cornerStyles,
        ...this.props.theme.Bubble[this.props.position].containerToPrevious,
      };
    }
    return cornerStyles;
  }

  renderBubbleText() {
    if (this.props.text) {
      if (this.props.renderBubbleText) {
        this.props.renderBubbleText({
          text: this.props.text,
          theme: this.props.theme,
        });
      }
      return (
        <BubbleText
          text={this.props.text}
          theme={this.props.theme}
          locale={this.props.locale}
        />
      );
    }
    return null;
  }

  renderLocation() {
    if (this.props.location) {
      if (this.props.renderLocation) {
        this.props.renderLocation({
          ...this.props.location,
          theme: this.props.theme,
        });
      }
      return (
        <Location
          location={this.props.location}
          theme={this.props.theme}
          locale={this.props.locale}
        />
      );
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      const {
        renderAvatar,
        renderDay,
        renderTime,
        renderLocation,
        renderBubbleText,
        renderCustomView,
        ...other,
      } = this.props;
      return this.props.renderCustomView(other);
    }
    return null;
  }

  renderTime() {
    if (this.props.time) {
      if (this.props.renderTime) {
        return this.props.renderTime({
          time: this.props.time,
          theme: this.props.theme,
        });
      }
      return (
        <Time
          time={this.props.time}
          theme={this.props.theme}
          locale={this.props.locale}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[this.props.theme.Bubble[this.props.position].container, this.handleBubbleCorners()]}>
        {this.renderLocation()}
        {this.renderBubbleText()}
        {this.renderCustomView()}
        {this.renderTime()}
      </View>
    );
  }
}

export default Bubble;
