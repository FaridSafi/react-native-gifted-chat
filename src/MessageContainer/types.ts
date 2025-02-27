import React, { Component, RefObject } from 'react'
import {
  FlatListProps,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { LoadEarlierProps } from '../LoadEarlier'
import { MessageProps } from '../Message'
import { User, IMessage, Reply } from '../types'
import { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes'
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated'
import { AnimateProps } from 'react-native-reanimated'

export type ListViewProps = {
  onLayout?: (event: LayoutChangeEvent) => void
} & object

export type AnimatedList<TMessage> = Component<AnimateProps<FlatListProps<TMessage>>, unknown, unknown> & FlatList<FlatListProps<TMessage>>

export interface MessageContainerProps<TMessage extends IMessage = IMessage> {
  forwardRef?: RefObject<AnimatedList<TMessage>>
  messages?: TMessage[]
  isTyping?: boolean
  user?: User
  listViewProps?: ListViewProps
  inverted?: boolean
  loadEarlier?: boolean
  alignTop?: boolean
  isScrollToBottomEnabled?: boolean
  scrollToBottomStyle?: StyleProp<ViewStyle>
  invertibleScrollViewProps?: object
  extraData?: object
  scrollToBottomOffset?: number
  renderChatEmpty?(): React.ReactNode
  renderFooter?(props: MessageContainerProps<TMessage>): React.ReactNode
  renderMessage?(props: MessageProps<TMessage>): React.ReactElement
  renderLoadEarlier?(props: LoadEarlierProps): React.ReactNode
  renderTypingIndicator?(): React.ReactNode
  scrollToBottomComponent?(): React.ReactNode
  onLoadEarlier?(): void
  onQuickReply?(replies: Reply[]): void
  infiniteScroll?: boolean
  isLoadingEarlier?: boolean
  handleOnScroll?(event: ReanimatedScrollEvent): void
}

export interface State {
  showScrollBottom: boolean
  hasScrolled: boolean
}

interface ViewLayout {
  x: number
  y: number
  width: number
  height: number
}

export type DaysPositions = { [key: string]: ViewLayout & { createdAt: number } }
