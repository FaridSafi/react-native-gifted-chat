import PropTypes from 'prop-types'
import React from 'react'

import { ListView, FlatList, View } from 'react-native'

import shallowequal from 'shallowequal'
import { InvertibleFlatList } from 'react-native-invertible-flat-list'
import md5 from 'md5'
import LoadEarlier from './LoadEarlier'
import Message from './Message'

export default class MessageContainer extends React.Component {
  constructor(props) {
    super(props)

    this.renderRow = this.renderRow.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this)

    const messagesData = this.prepareMessages(props.messages)
    this.state = {
      dataSource: messagesData
    }
  }

  // Groups messages
  prepareMessages(messages) {
    return {
      keys: messages.map(m => m._id),
      blob: messages.reduce((o, m, i) => {
        const previousMessage = messages[i + 1] || {}
        const nextMessage = messages[i - 1] || {}
        // add next and previous messages to hash to ensure updates
        const toHash = JSON.stringify(m) + previousMessage._id + nextMessage._id
        o[m._id] = {
          ...m,
          previousMessage,
          nextMessage,
          hash: md5(toHash)
        }
        return o
      }, {})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.messages.length !== nextProps.messages.length) {
      return true
    }
    if (!shallowequal(this.props, nextState)) {
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return
    }
    const messagesData = this.prepareMessages(nextProps.messages)
    this.setState({
      dataSource: messagesData
    })
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props
      }
      return this.props.renderFooter(footerProps)
    }
    return null
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props
      }
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps)
      }
      return <LoadEarlier {...loadEarlierProps} />
    }
    return null
  }

  scrollToEnd(animated = true) {
    this._listRef.scrollToOffset({ offset: 0, animated })
  }

  renderRow = ({ item }) => {
    const message = this.state.dataSource.blob[item]
    if (!message._id && message._id !== 0) {
      console.warn(
        'GiftedChat: `_id` is missing for message',
        JSON.stringify(message)
      )
    }
    if (!message.user) {
      console.warn(
        'GiftedChat: `user` is missing for message',
        JSON.stringify(message)
      )
      message.user = {}
    }

    const messageProps = {
      ...this.props,
      key: message._id,
      currentMessage: message,
      previousMessage: message.previousMessage,
      nextMessage: message.nextMessage,
      position: message.user._id === this.props.user._id ? 'right' : 'left'
    }

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps)
    }
    return <Message {...messageProps} />
  }

  render() {
    return (
      <InvertibleFlatList
        inverted={true}
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        removeClippedSubviews={true}
        pageSize={20}
        {...this.props.listViewProps}
        style={{ flexGrow: 1 }}
        ref={component => (this._listRef = component)}
        data={this.state.dataSource.keys}
        keyExtractor={(item, idx) => item}
        renderItem={this.renderRow}
        renderHeader={this.renderFooter}
        renderFooter={this.renderLoadEarlier}
      />
    )
  }
}

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => { }
}

MessageContainer.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object
}
