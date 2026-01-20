import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { SharedValue } from 'react-native-reanimated'

import { MessageReplyProps } from '../components/MessageReply'
import { ReplyPreviewProps } from '../components/ReplyPreview'
import { IMessage, ReplyMessage } from '../Models'

/**
 * Props for swipe-to-reply gesture behavior
 */
export interface SwipeToReplyProps<TMessage extends IMessage> {
  /** Enable swipe to reply on messages; default is false */
  isEnabled?: boolean
  /** Direction to swipe for reply; default is 'left' (swipe left, icon appears on right) */
  direction?: 'left' | 'right'
  /** Callback when swipe to reply is triggered */
  onSwipe?: (message: TMessage) => void
  /** Custom render for swipe action indicator */
  renderAction?: (
    progress: SharedValue<number>,
    translation: SharedValue<number>,
    position: 'left' | 'right'
  ) => React.ReactNode
  /** Style for the swipe action container */
  actionContainerStyle?: StyleProp<ViewStyle>
}

/**
 * Props for reply preview shown above input toolbar
 */
export interface ReplyPreviewStyleProps {
  /** Style for reply preview container */
  containerStyle?: StyleProp<ViewStyle>
  /** Style for reply preview text */
  textStyle?: StyleProp<TextStyle>
  /** Style for reply preview image */
  imageStyle?: StyleProp<ImageStyle>
}

/**
 * Props for message reply display inside bubble
 */
export interface MessageReplyStyleProps {
  /** Style for message reply container */
  containerStyle?: StyleProp<ViewStyle>
  /** Style for message reply container on left side */
  containerStyleLeft?: StyleProp<ViewStyle>
  /** Style for message reply container on right side */
  containerStyleRight?: StyleProp<ViewStyle>
  /** Style for message reply image */
  imageStyle?: StyleProp<ImageStyle>
  /** Style for message reply text */
  textStyle?: StyleProp<TextStyle>
  /** Style for message reply text on left side */
  textStyleLeft?: StyleProp<TextStyle>
  /** Style for message reply text on right side */
  textStyleRight?: StyleProp<TextStyle>
}

/**
 * Grouped props for reply functionality
 */
export interface ReplyProps<TMessage extends IMessage> {
  /** Reply message to show in input toolbar preview */
  message?: ReplyMessage | null
  /** Callback when reply is cleared */
  onClear?: () => void
  /** Callback when message reply is pressed inside bubble */
  onPress?: (replyMessage: ReplyMessage) => void
  /** Custom render for reply preview in input toolbar */
  renderPreview?: (props: ReplyPreviewProps) => React.ReactNode
  /** Custom render for message reply inside bubble */
  renderMessageReply?: (props: MessageReplyProps<TMessage>) => React.ReactNode
  /** Swipe-to-reply configuration */
  swipe?: SwipeToReplyProps<TMessage>
  /** Reply preview styling */
  previewStyle?: ReplyPreviewStyleProps
  /** Message reply styling */
  messageStyle?: MessageReplyStyleProps
}
