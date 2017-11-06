import PropTypes from 'prop-types';
import React from 'react';

import {
  FlatList,
  View,
  StyleSheet,
} from 'react-native';

import shallowequal from 'shallowequal';
import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.state = {
      messagesData: this.prepareMessages(props.messages)
    }; 
  }

  prepareMessages(messages) {
    return output = messages.reduce((o,m,i) => {
      const previousMessage = messages[i + 1] || {}
      const nextMessage = messages[i - 1] || {}
      o.push( {
        ...m,
        previousMessage,
        nextMessage
      })
      return o
    },[])
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

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return;
    }
    this.setState({
      messagesData: this.prepareMessages(nextProps.messages)
    })
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
    this.refs.flatListRef.scrollToOffset(options)
  }

  renderRow({item,index}) {
    if (!item._id && item._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    }
    if (!item.user) {
      if (!item.system) {
        console.warn("GiftedChat: `user` is missing for message", JSON.stringify(item));
      }
      item.user = {};
    }

    const messageProps = {
      ...this.props,
      key: item._id,
      currentMessage: item,
      previousMessage: item.previousMessage,
      nextMessage: item.nextMessage,
      position: item.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return (
      <View style={{ transform: [{ scaleY: -1 },{perspective: 1280}]}}>
        <Message {...messageProps}/>
      </View>
    )
  }

  renderHeaderWrapper = () => {
    return <View style={{ flex: 1, transform: [{ scaleY: -1 },{perspective: 1280}] }}>{this.renderLoadEarlier()}</View>;
  };

  _keyExtractor = (item, index) => item._id+" "+index

  render() {
    return (
      <View
        ref='container'
        style={styles.container}
      >
        <FlatList
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          initialListSize={20}
          pageSize={20}
          ref='flatListRef'
          keyExtractor={this._keyExtractor}
          {...this.props.listViewProps}

          data={this.state.messagesData}

          renderItem={this.renderRow}
          renderHeader={this.renderFooter}
          renderFooter={this.renderLoadEarlier()}
          style={{transform: [{scaleY: -1 },{perspective: 1280}]}}
          {...this.props.invertibleScrollViewProps}
          ListFooterComponent={this.renderHeaderWrapper}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {
  },
};

MessageContainer.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object,
};
