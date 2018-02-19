/* eslint
    no-console: 0,
    no-param-reassign: 0,
    no-use-before-define: ["error", { "variables": false }],
    no-return-assign: 0,
    react/no-string-refs: 0
*/

import PropTypes from 'prop-types';
import React from 'react';

import { ListView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import shallowequal from 'shallowequal';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1.hash !== r2.hash;
      },
    });

    const messagesData = this.prepareMessages(props.messages);
    this.state = {
      dataSource: dataSource.cloneWithRows(messagesData.blob, messagesData.keys),
      showScrollBottom: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return;
    }
    const messagesData = this.prepareMessages(nextProps.messages);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(messagesData.blob, messagesData.keys),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  prepareMessages(messages) {
    return {
      keys: messages.map((m) => m._id),
      blob: messages.reduce((o, m, i) => {
        const previousMessage = messages[i + 1] || {};
        const nextMessage = messages[i - 1] || {};
        // add next and previous messages to hash to ensure updates
        const toHash = JSON.stringify(m) + previousMessage._id + nextMessage._id;
        o[m._id] = {
          ...m,
          previousMessage,
          nextMessage,
          hash: md5(toHash),
        };
        return o;
      }, {}),
    };
  }

  scrollToBottom = () => {
    this.scrollTo({x:0,y:0, animated: 'true'});
  }

  scrollTo(options) {
    this._invertibleScrollViewRef.scrollTo(options);
  }

  handleOnScroll(event) {
    if(event.nativeEvent.contentOffset.y > 350){
      this.setState({showScrollBottom: true});
    } else {
      this.setState({showScrollBottom: false});
    }
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return <LoadEarlier {...loadEarlierProps} />;
    }
    return null;
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

  renderRow(message) {
    if (!message._id && message._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(message));
    }
    if (!message.user) {
      if (!message.system) {
        console.warn('GiftedChat: `user` is missing for message', JSON.stringify(message));
      }
      message.user = {};
    }

    const messageProps = {
      ...this.props,
      key: message._id,
      currentMessage: message,
      previousMessage: message.previousMessage,
      nextMessage: message.nextMessage,
      position: message.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return <Message {...messageProps} />;
  }

  renderScrollComponent(props) {
    const { invertibleScrollViewProps } = this.props;
    return (
      <InvertibleScrollView
        {...props}
        {...invertibleScrollViewProps}
        ref={(component) => (this._invertibleScrollViewRef = component)}
      />
    );
  }

  render() {
    const contentContainerStyle = this.props.inverted
      ? {}
      : styles.notInvertedContentContainerStyle;
    
    const scrollToBottomComponent = (
      <View style={styles.scrollToBottomStyle}>
        <TouchableOpacity onPress={this.scrollToBottom} hitSlop={{top:5,left:5,right:5,bottom:5}}>
          <Text>🔽</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View ref="container" style={styles.container}>
        {this.state.showScrollBottom ? scrollToBottomComponent : null}
        <ListView
          enableEmptySections
          automaticallyAdjustContentInsets={false}
          initialListSize={20}
          pageSize={20}
          {...this.props.listViewProps}
          dataSource={this.state.dataSource}
          contentContainerStyle={contentContainerStyle}
          renderRow={this.renderRow}
          renderHeader={this.props.inverted ? this.renderFooter : this.renderLoadEarlier}
          renderFooter={this.props.inverted ? this.renderLoadEarlier : this.renderFooter}
          renderScrollComponent={this.renderScrollComponent}
          onScroll={this.handleOnScroll}
          scrollEventThrottle={100}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notInvertedContentContainerStyle: {
    justifyContent: 'flex-end',
  },
  scrollToBottomStyle: {
    position: 'absolute',
    paddingHorizontal: 15,
    paddingVertical: 8,
    right: 0,
    bottom: 30,
    zIndex: 999,
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 1,
  }
});

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => { },
  inverted: true,
  loadEarlier: false,
  listViewProps: {},
  invertibleScrollViewProps: {},
};

MessageContainer.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  renderLoadEarlier: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object,
  inverted: PropTypes.bool,
  loadEarlier: PropTypes.bool,
  invertibleScrollViewProps: PropTypes.object,
};
