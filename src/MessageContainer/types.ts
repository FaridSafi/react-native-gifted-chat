import React, { RefObject } from 'react'
import {
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { LoadEarlierProps } from 'react-native-gifted-chat/src/LoadEarlier'
import Message from 'react-native-gifted-chat/src/Message'
import { User, IMessage, Reply } from 'react-native-gifted-chat/src/Models'

export interface MessageContainerProps<TMessage extends IMessage> {
  messages?: TMessage[]
  isTyping?: boolean
  user?: User
  listViewProps: object
  inverted?: boolean
  loadEarlier?: boolean
  alignTop?: boolean
  scrollToBottom?: boolean
  scrollToBottomStyle?: StyleProp<ViewStyle>
  invertibleScrollViewProps?: object
  extraData?: object
  scrollToBottomOffset?: number
  forwardRef?: RefObject<FlatList<TMessage>>
  renderChatEmpty?(): React.ReactNode
  renderFooter?(props: MessageContainerProps<TMessage>): React.ReactNode
  renderMessage?(props: Message['props']): React.ReactElement
  renderLoadEarlier?(props: LoadEarlierProps): React.ReactNode
  renderTypingIndicator?(): React.ReactNode
  scrollToBottomComponent?(): React.ReactNode
  onLoadEarlier?(): void
  onQuickReply?(replies: Reply[]): void
  infiniteScroll?: boolean
  isLoadingEarlier?: boolean
  handleOnScroll?(event: NativeSyntheticEvent<NativeScrollEvent>): void
}

export interface State {
  showScrollBottom: boolean
  hasScrolled: boolean
}
