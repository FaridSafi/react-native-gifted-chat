import React, { RefObject } from 'react'
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { FlashList } from '@shopify/flash-list'

import { LoadEarlierProps } from '../LoadEarlier'
import Message from '../Message'
import { User, IMessage, Reply } from '../Models'

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
  forwardRef?: RefObject<FlashList<TMessage>>
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
