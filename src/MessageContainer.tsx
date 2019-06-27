import PropTypes from 'prop-types'
import React, { RefObject } from 'react'

import {
  FlatList,
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Text,
  ListViewProps,
  ListRenderItemInfo,
} from 'react-native'

import LoadEarlier from './LoadEarlier'
import Message from './Message'
import Color from './Color'
import { User, IMessage } from './types'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAlignTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  scrollToBottomStyle: {
    opacity: 0.8,
    position: 'absolute',
    paddingHorizontal: 15,
    paddingVertical: 8,
    right: 10,
    bottom: 30,
    zIndex: 999,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
})

export interface MessageContainerProps<TMessage extends IMessage> {
  messages?: TMessage[]
  user?: User
  listViewProps: Partial<ListViewProps>
  inverted?: boolean
  loadEarlier?: boolean
  alignTop?: boolean
  scrollToBottom?: boolean
  invertibleScrollViewProps?: any
  extraData?: any
  scrollToBottomOffset?: number
  renderFooter?(props: MessageContainerProps<TMessage>): React.ReactNode
  renderMessage?(props: Message['props']): React.ReactNode
  renderLoadEarlier?(props: LoadEarlier['props']): React.ReactNode
  scrollToBottomComponent?(): React.ReactNode
  onLoadEarlier?(): void
}

export default class MessageContainer<
  TMessage extends IMessage = IMessage
> extends React.PureComponent<
  MessageContainerProps<TMessage>,
  { showScrollBottom: boolean }
> {
  static defaultProps = {
    messages: [],
    user: {},
    renderFooter: null,
    renderMessage: null,
    onLoadEarlier: () => {},
    inverted: true,
    loadEarlier: false,
    listViewProps: {},
    invertibleScrollViewProps: {},
    extraData: null,
    scrollToBottom: false,
    scrollToBottomOffset: 200,
    alignTop: false,
  }

  static propTypes = {
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
    scrollToBottom: PropTypes.bool,
    scrollToBottomOffset: PropTypes.number,
    scrollToBottomComponent: PropTypes.func,
    alignTop: PropTypes.bool,
  }

  state = {
    showScrollBottom: false,
  }

  flatListRef?: RefObject<FlatList<TMessage>> = React.createRef()

  componentDidMount() {
    if (this.props.messages && this.props.messages.length === 0) {
      this.attachKeyboardListeners()
    }
  }

  componentWillUnmount() {
    this.detachKeyboardListeners()
  }

  componentWillReceiveProps(nextProps: MessageContainerProps<TMessage>) {
    if (
      this.props.messages &&
      this.props.messages.length === 0 &&
      nextProps.messages &&
      nextProps.messages.length > 0
    ) {
      this.detachKeyboardListeners()
    } else if (
      this.props.messages &&
      nextProps.messages &&
      this.props.messages.length > 0 &&
      nextProps.messages.length === 0
    ) {
      this.attachKeyboardListeners()
    }
  }

  attachKeyboardListeners = () => {
    const { invertibleScrollViewProps: invertibleProps } = this.props
    if (invertibleProps) {
      Keyboard.addListener(
        'keyboardWillShow',
        invertibleProps.onKeyboardWillShow,
      )
      Keyboard.addListener('keyboardDidShow', invertibleProps.onKeyboardDidShow)
      Keyboard.addListener(
        'keyboardWillHide',
        invertibleProps.onKeyboardWillHide,
      )
      Keyboard.addListener('keyboardDidHide', invertibleProps.onKeyboardDidHide)
    }
  }

  detachKeyboardListeners = () => {
    const { invertibleScrollViewProps: invertibleProps } = this.props
    Keyboard.removeListener(
      'keyboardWillShow',
      invertibleProps.onKeyboardWillShow,
    )
    Keyboard.removeListener(
      'keyboardDidShow',
      invertibleProps.onKeyboardDidShow,
    )
    Keyboard.removeListener(
      'keyboardWillHide',
      invertibleProps.onKeyboardWillHide,
    )
    Keyboard.removeListener(
      'keyboardDidHide',
      invertibleProps.onKeyboardDidHide,
    )
  }

  renderFooter = () => {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      }
      return this.props.renderFooter(footerProps)
    }
    return null
  }

  renderLoadEarlier = () => {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      }
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps)
      }
      return <LoadEarlier {...loadEarlierProps} />
    }
    return null
  }

  scrollTo(options: { animated?: boolean; offset: number }) {
    if (this.flatListRef && this.flatListRef.current && options) {
      this.flatListRef.current.scrollToOffset(options)
    }
  }

  scrollToBottom = () => {
    this.scrollTo({ offset: 0, animated: true })
  }

  handleOnScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > this.props.scrollToBottomOffset!) {
      this.setState({ showScrollBottom: true })
    } else {
      this.setState({ showScrollBottom: false })
    }
  }

  renderRow = ({ item, index }: ListRenderItemInfo<TMessage>) => {
    if (!item._id && item._id !== 0) {
      console.warn(
        'GiftedChat: `_id` is missing for message',
        JSON.stringify(item),
      )
    }
    if (!item.user) {
      if (!item.system) {
        console.warn(
          'GiftedChat: `user` is missing for message',
          JSON.stringify(item),
        )
      }
      item.user = { _id: 0 }
    }
    const { messages, user, ...restProps } = this.props
    if (messages && user) {
      const previousMessage = messages[index + 1] || {}
      const nextMessage = messages[index - 1] || {}

      const messageProps: Message['props'] = {
        ...restProps,
        user,
        key: item._id,
        currentMessage: item,
        previousMessage,
        nextMessage,
        position: item.user._id === user._id ? 'right' : 'left',
      }

      if (this.props.renderMessage) {
        return this.props.renderMessage(messageProps)
      }
      return <Message {...messageProps} />
    }
    return null
  }

  renderHeaderWrapper = () => (
    <View style={styles.headerWrapper}>{this.renderLoadEarlier()}</View>
  )

  renderScrollBottomComponent() {
    const { scrollToBottomComponent } = this.props

    if (scrollToBottomComponent) {
      return scrollToBottomComponent()
    }

    return <Text>V</Text>
  }

  renderScrollToBottomWrapper() {
    return (
      <View style={styles.scrollToBottomStyle}>
        <TouchableOpacity
          onPress={this.scrollToBottom}
          hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
        >
          {this.renderScrollBottomComponent()}
        </TouchableOpacity>
      </View>
    )
  }

  keyExtractor = (item: TMessage) => `${item._id}`

  render() {
    if (
      !this.props.messages ||
      (this.props.messages && this.props.messages.length === 0)
    ) {
      return <View style={styles.container} />
    }
    return (
      <View
        style={
          this.props.alignTop ? styles.containerAlignTop : styles.container
        }
      >
        {this.state.showScrollBottom && this.props.scrollToBottom
          ? this.renderScrollToBottomWrapper()
          : null}
        <FlatList
          ref={this.flatListRef}
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
          onScroll={this.handleOnScroll}
          scrollEventThrottle={100}
          {...this.props.listViewProps}
        />
      </View>
    )
  }
}
