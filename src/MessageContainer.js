import React, {Component, PropTypes} from 'react';

import ReactNative, {
  View,
  ListView
} from 'react-native';

import shallowCompare from 'react-addons-shallow-compare';

import InvertibleScrollView from 'react-native-invertible-scroll-view';

import LoadEarlier from './LoadEarlier';
import Message from './Message';

import md5 from 'md5';

export default class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1.hash !== r2.hash;
      }
    });
    const messages = props.messages.map(message => ({
      ...message,
      hash: md5(JSON.stringify(message))
    }));
    this.state = {
      dataSource: dataSource.cloneWithRows(messages)
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return;
    }
    const messages = nextProps.messages.map(message => ({
      ...message,
      hash: md5(JSON.stringify(message))
    }));
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(messages)
    });
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
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

  renderRow(message, sectionId, rowId) {
    if (!message._id) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(message));
    }
    if (!message.user) {
      console.warn('GiftedChat: `user` is missing for message', JSON.stringify(message));
      message.user = {};
    }

    const index = Number(rowId);

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
  }

  renderScrollComponent(props) {
    const invertibleScrollViewProps = this.props.invertibleScrollViewProps;
    return (
      <InvertibleScrollView
        {...invertibleScrollViewProps}
        ref={component => this._invertibleScrollViewRef = component}
      />
    );
  }

  render() {
    return (
      <View ref='container' style={{flex:1}}>
        <ListView
          enableEmptySections={true}
          keyboardShouldPersistTaps={true}
          automaticallyAdjustContentInsets={false}

          dataSource={this.state.dataSource}

          renderRow={this.renderRow}
          renderHeader={this.renderFooter}
          renderFooter={this.renderLoadEarlier}
          renderScrollComponent={this.renderScrollComponent}
        />
      </View>
    );
  }
}

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {
  },
};