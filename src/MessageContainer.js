/* eslint
    no-console: 0,
    no-param-reassign: 0,
    no-use-before-define: ["error", { "variables": false }],
    no-return-assign: 0,
    react/no-string-refs: 0,
    react/sort-comp: 0
*/

import PropTypes from 'prop-types';
import React from 'react';

import { FlatList, View, StyleSheet, Keyboard } from 'react-native';

import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {

  componentDidMount() {
    if (this.props.messages.length === 0) {
      this.attachKeyboardListeners();
    }
  }

  shouldComponentUpdate(nextProps) {
    const next = nextProps.messages;
    const current = this.props.messages;
    return (
      next.length !== current.length || next.extraData !== current.extraData || next.loadEarlier !== current.loadEarlier
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages.length === 0 && nextProps.messages.length > 0) {
      this.detachKeyboardListeners();
    } else if (this.props.messages.length > 0 && nextProps.messages.length === 0) {
      this.attachKeyboardListeners(nextProps);
    }
  }

  attachKeyboardListeners = () => {
    const { invertibleScrollViewProps: invertibleProps } = this.props;
    Keyboard.addListener('keyboardWillShow', invertibleProps.onKeyboardWillShow);
    Keyboard.addListener('keyboardDidShow', invertibleProps.onKeyboardDidShow);
    Keyboard.addListener('keyboardWillHide', invertibleProps.onKeyboardWillHide);
    Keyboard.addListener('keyboardDidHide', invertibleProps.onKeyboardDidHide);
  };

  detachKeyboardListeners = () => {
    const { invertibleScrollViewProps: invertibleProps } = this.props;
    Keyboard.removeListener('keyboardWillShow', invertibleProps.onKeyboardWillShow);
    Keyboard.removeListener('keyboardDidShow', invertibleProps.onKeyboardDidShow);
    Keyboard.removeListener('keyboardWillHide', invertibleProps.onKeyboardWillHide);
    Keyboard.removeListener('keyboardDidHide', invertibleProps.onKeyboardDidHide);
  };

  renderFooter = () => {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
  };

  renderLoadEarlier = () => {
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
  };

  scrollTo(options) {
    if (this.flatListRef && options) {
      this.flatListRef.scrollToOffset(options);
    }
  }

  renderRow = ({ item, index }) => {
    if (!item._id && item._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    }
    if (!item.user) {
      if (!item.system) {
        console.warn('GiftedChat: `user` is missing for message', JSON.stringify(item));
      }
      item.user = {};
    }
    const { messages, ...restProps } = this.props;
    const previousMessage = messages[index + 1] || {};
    const nextMessage = messages[index - 1] || {};

    const messageProps = {
      ...restProps,
      key: item._id,
      currentMessage: item,
      previousMessage,
      nextMessage,
      position: item.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return <Message {...messageProps} />;
  };

  renderHeaderWrapper = () => <View style={styles.headerWrapper}>{this.renderLoadEarlier()}</View>;

  keyExtractor = (item) => `${item._id}`;

  render() {
    if (this.props.messages.length === 0) {
      return <View style={styles.container} />;
    }
    return (
      <View style={styles.container}>
        <FlatList
          ref={(ref) => (this.flatListRef = ref)}
          extraData={this.props.extraData}
          keyExtractor={this.keyExtractor}
          enableEmptySections
          automaticallyAdjustContentInsets={false}
          inverted={this.props.inverted}
          data={this.props.messages}
          style={styles.listStyle}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={this.renderRow}
          {...this.props.invertibleScrollViewProps}
          ListFooterComponent={this.renderHeaderWrapper}
          ListHeaderComponent={this.renderFooter}
          {...this.props.listViewProps}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    justifyContent: 'flex-end',
  },
  headerWrapper: {
    flex: 1,
  },
  listStyle: {
    flex: 1,
  },
});

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {},
  inverted: true,
  loadEarlier: false,
  listViewProps: {},
  invertibleScrollViewProps: {}, // TODO: support or not?
  extraData: null,
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
  extraData: PropTypes.object,
};
