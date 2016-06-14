import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import Time from './Time';
import Location from './Location';
import BubbleText from './BubbleText';

class Bubble extends Component {
  handleBubbleToNext() {
    if (this.props.isSameUser(this.props, this.props.nextMessage) && this.props.isSameDay(this.props, this.props.nextMessage)) {
      return this.props.theme.Bubble[this.props.position].containerToNext;
    }
    return null;
  }
  handleBubbleToPrevious() {
    if (this.props.isSameUser(this.props, this.props.previousMessage) && this.props.isSameDay(this.props, this.props.previousMessage)) {
      return this.props.theme.Bubble[this.props.position].containerToPrevious;
    }
    return null;
  }
  renderBubbleText() {
    if (this.props.text) {
      if (this.props.renderBubbleText) {
        this.props.renderBubbleText({
          text: this.props.text,
          theme: this.props.theme,
          locale: this.props.locale,
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
          locale: this.props.locale,
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

  renderTime() {
    if (this.props.time) {
      if (this.props.renderTime) {
        return this.props.renderTime({
          time: this.props.time,
          theme: this.props.theme,
          locale: this.props.locale,
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

  renderCustomView() {
    if (this.props.renderCustomView) {
      const customViewProps = {};
      for (let key in this.props) {
        if (this.props.hasOwnProperty[key]) {
          if (key.indexOf('render') !== 0) { // customView is not meant to be used to render other built-in components
            customViewProps[key] = this.props[key];
          }
        }
      }
      return this.props.renderCustomView(customViewProps);
    }
    return null;
  }

  render() {
    return (
      <View style={[this.props.theme.Bubble[this.props.position].container, this.handleBubbleToNext(), this.handleBubbleToPrevious()]}>
        {this.renderLocation()}
        {this.renderBubbleText()}
        {this.renderCustomView()}
        {this.renderTime()}
      </View>
    );
  }
}

export default Bubble;
