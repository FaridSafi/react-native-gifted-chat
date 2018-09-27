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

export default class MessageContainer extends React.PureComponent {

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderHeaderWrapper = this.renderHeaderWrapper.bind(this);
    this.attachKeyboardListeners = this.attachKeyboardListeners.bind(this);
    this.detatchKeyboardListeners = this.detatchKeyboardListeners.bind(this);

    if (props.messages.length === 0) {
      this.attachKeyboardListeners(props);
    }

    //new
    this.state = {
      showDateBubble: false,
      showScrollToBottomButton: false,
      currentDate: ''
    }

    this.onScroll = this.onScroll.bind(this);
    this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);
    this.renderScrollToBottomButton = this.renderScrollToBottomButton.bind(this);
    this.renderDateBubble = this.renderDateBubble.bind(this);

    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
    this.onScrollEndDrag = this.onScrollEndDrag.bind(this);
    this.hideDateBuddle = this.hideDateBuddle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages.length === 0 && nextProps.messages.length > 0) {
      this.detatchKeyboardListeners();
    } else if (this.props.messages.length > 0 && nextProps.messages.length === 0) {
      this.attachKeyboardListeners(nextProps);
    }
  }

  attachKeyboardListeners(props) {
    Keyboard.addListener('keyboardWillShow', props.invertibleScrollViewProps.onKeyboardWillShow);
    Keyboard.addListener('keyboardDidShow', props.invertibleScrollViewProps.onKeyboardDidShow);
    Keyboard.addListener('keyboardWillHide', props.invertibleScrollViewProps.onKeyboardWillHide);
    Keyboard.addListener('keyboardDidHide', props.invertibleScrollViewProps.onKeyboardDidHide);
  }

  detatchKeyboardListeners() {
    Keyboard.removeListener('keyboardWillShow', this.props.invertibleScrollViewProps.onKeyboardWillShow);
    Keyboard.removeListener('keyboardDidShow', this.props.invertibleScrollViewProps.onKeyboardDidShow);
    Keyboard.removeListener('keyboardWillHide', this.props.invertibleScrollViewProps.onKeyboardWillHide);
    Keyboard.removeListener('keyboardDidHide', this.props.invertibleScrollViewProps.onKeyboardDidHide);
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
      return <LoadEarlier {...loadEarlierProps} />;
    }
    return null;
  }

  renderDateBubble() {
    const dateBubbleProps = { date: this.state.currentDate }
    return this.props.renderDateBubble ?
      this.props.renderDateBubble(dateBubbleProps) : null
  }

  renderScrollToBottomButton() {
    const buttonProps = { onPress: this.scrollToBottom }
    return this.props.renderScrollToBottomButton ?
      this.props.renderScrollToBottomButton(buttonProps) : null
  }

  scrollTo(options) {
    if (this.flatListRef) {
      this.flatListRef.scrollToOffset(options);
    }
  }

  onMomentumScrollEnd() {
    this.hideDateBuddle()
  }

  onScrollEndDrag() {
    this.hideDateBuddle()
  }

  hideDateBuddle() {
    if (this.props.renderDateBubble && !this.dateBubbleDisappearTimer) {
      const timeout = this.props.dateBubbleTimeout > 0 ?
        this.props.dateBubbleTimeout : 1000
      this.dateBubbleDisappearTimer = setTimeout(
        () => { this.setState({ currentDate: '' }) }
        , timeout
      )
    }
  }

  scrollToBottom = () => {
    this.scrollTo({ offset: 0, animated: 'true' });
  }

  onScroll(event) {
    const yOffset = event.nativeEvent.contentOffset.y
    let showDateBubble = this.state.showDateBubble
    let showScrollToBottomButton = this.state.showScrollToBottomButton

    if (this.dateBubbleDisappearTimer) {
      clearTimeout(this.dateBubbleDisappearTimer);
      this.dateBubbleDisappearTimer = null;
    }

    if (this.props.renderScrollToBottomButton) {
      const targetOffset = this.props.scrollToButtomButtonOffset > 0 ?
        this.props.scrollToButtomButtonOffset : 200

        showScrollToBottomButton = yOffset > targetOffset
    }

    if (this.props.renderDateBubble) {
      const targetOffset = this.props.dateBubbleOffset > 0 ?
        this.props.dateBubbleOffset : 200
      showDateBubble = yOffset > targetOffset
    }

    this.setState({
      showDateBubble: showDateBubble,
      showScrollToBottomButton: showScrollToBottomButton,
    })
  }

  onViewableItemsChanged = ({ viewableItems }) => {
    if (this.props.renderDateBubble) {
      let currentDate = ''

      if (viewableItems && viewableItems.length > 0 &&
        this.state.showDateBubble) {
        const msg = viewableItems[viewableItems.length - 1].item
        if (msg && msg.createdAt) {
          currentDate = msg.createdAt
        }
      }

      this.setState({
        currentDate: currentDate,
      })
    }
  }

  renderRow({ item, index }) {
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
  }

  renderHeaderWrapper() {
    return <View style={styles.headerWrapper}>{this.renderLoadEarlier()}</View>;
  }

  render() {
    if (this.props.messages.length === 0) {
      return <View style={styles.container} />;
    }
    return (
      <View style={styles.container}>
        <FlatList
          ref={(ref) => (this.flatListRef = ref)}
          keyExtractor={(item) => item._id}
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
          //new
          onEndReachedThreshold={0.2}
          scrollEventThrottle={10}
          onScroll={this.onScroll}
          onViewableItemsChanged={this.onViewableItemsChanged}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScrollEndDrag={this.onScrollEndDrag}
        />
        {!!this.state.currentDate && this.renderDateBubble()}
        {this.state.showScrollToBottomButton && this.renderScrollToBottomButton()}
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
  onLoadEarlier: () => { },
  inverted: true,
  loadEarlier: false,
  listViewProps: {},
  invertibleScrollViewProps: {}, // TODO: support or not?

  renderDateBubble: null,
  dateBubbleOffset: 200,
  dateBubbleTimeout: 1000,
  renderScrollToBottomButton: null,
  scrollToButtomButtonOffset: 200,
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
  invertibleScrollViewProps: PropTypes.object, // TODO: support or not?

  renderDateBubble: PropTypes.func,
  renderScrollToBottomButton: PropTypes.func,
  dateBubbleOffset: PropTypes.number,
  scrollToButtomButtonOffset: PropTypes.number,
};