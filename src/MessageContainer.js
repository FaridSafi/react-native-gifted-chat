import React, { Component, PropTypes } from 'react';

import InvertibleScrollView from 'react-native-invertible-scroll-view';

import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.messagesHash === nextProps.messagesHash && this.props.loadEarlier === nextProps.loadEarlier) {
      return false;
    }
    return true;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return (
        <LoadEarlier {...loadEarlierProps}/>
      );
    }
    return null;
  }

  scrollTo(options) {
    this._invertibleScrollViewRef.scrollTo(options);
  }

  render() {
    return (
      <InvertibleScrollView
        {...this.props.invertibleScrollViewProps}
        ref={component => this._invertibleScrollViewRef = component}
      >
        {this.props.messages.map((message, index) => {
          if (!message._id) {
            console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(message));
          }
          if (!message.user) {
            console.warn('GiftedChat: `user` is missing for message', JSON.stringify(message));
            message.user = {};
          }

          const messageProps = {
            ...this.props,
            key: message._id,
            currentMessage: message,
            previousMessage: this.props.messages[index + 1] || {},
            nextMessage: this.props.messages[index - 1] || {},
            position: message.user._id === this.props.user._id ? 'right' : 'left',
          };

          if (this.props.renderMessage) {
            return this.props.renderMessage(messageProps);
          }
          return <Message {...messageProps}/>;
        })}
        {this.renderLoadEarlier()}
      </InvertibleScrollView>
    );
  }
}

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderMessage: null,
  onLoadEarlier: () => {},
};
