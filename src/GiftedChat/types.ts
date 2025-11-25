import React, { RefObject } from 'react'
import {
  TextInput,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'
import {
  ActionSheetOptions,
} from '@expo/react-native-action-sheet'
import { KeyboardProvider, KeyboardAvoidingViewProps } from 'react-native-keyboard-controller'
import { ActionsProps } from '../Actions'
import { AvatarProps } from '../Avatar'
import { BubbleProps } from '../Bubble'
import { ComposerProps } from '../Composer'
import { InputToolbarProps } from '../InputToolbar'
import { MessageImageProps } from '../MessageImage'
import { AnimatedList, MessagesContainerProps } from '../MessagesContainer'
import { MessageTextProps } from '../MessageText'
import {
  IMessage,
  LeftRightStyle,
  MessageAudioProps,
  MessageVideoProps,
  User,
} from '../Models'
import { QuickRepliesProps } from '../QuickReplies'
import { SendProps } from '../Send'
import { SystemMessageProps } from '../SystemMessage'
import { TimeProps } from '../Time'

export interface GiftedChatProps<TMessage extends IMessage> extends Partial<MessagesContainerProps<TMessage>> {
  /* Messages container ref */
  messagesContainerRef?: RefObject<AnimatedList<TMessage>>
  /* text input ref */
  textInputRef?: RefObject<TextInput>
  /* Controls whether or not to show user.name property in the message bubble */
  isUsernameVisible?: boolean
  /* Messages container style */
  messagesContainerStyle?: StyleProp<ViewStyle>
  /* Input text; default is undefined, but if specified, it will override GiftedChat's internal state */
  text?: string
  initialText?: string
  /* User sending the messages: { _id, name, avatar } */
  user?: User
  /*  Locale to localize the dates */
  locale?: string
  /* Force color scheme (light/dark); default is undefined (uses system color scheme) */
  colorScheme?: 'light' | 'dark'
  /* Format to use for rendering times; default is 'LT' */
  timeFormat?: string
  /* Format to use for rendering dates; default is 'll' */
  dateFormat?: string
  /* Format to use for rendering relative times; Today - for now. See more: https://day.js.org/docs/en/plugin/calendar */
  dateFormatCalendar?: object
  /* Whether to render an avatar for the current user; default is false, only show avatars for other users */
  isUserAvatarVisible?: boolean
  /* When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is false */
  isAvatarVisibleForEveryMessage?: boolean
  /* Render the message avatar at the top of consecutive messages, rather than the bottom; default is false */
  isAvatarOnTop?: boolean
  /* Extra props to be passed to the <Image> component created by the default renderMessageImage */
  imageProps?: MessageImageProps<TMessage>
  /* Minimum height of the input toolbar; default is 44 */
  minInputToolbarHeight?: number
  /*  Extra props to be passed to the <TextInput>. See https://reactnative.dev/docs/textinput */
  textInputProps?: Partial<React.ComponentProps<typeof TextInput>>
  /* Force send button */
  isSendButtonAlwaysVisible?: boolean
  /* Image style */
  imageStyle?: StyleProp<ViewStyle>
  /* composer min Height */
  minComposerHeight?: number
  /* composer min Height */
  maxComposerHeight?: number
  actions?: Array<{ title: string, action: () => void }>
  actionSheetOptionTintColor?: string
  quickReplyStyle?: StyleProp<ViewStyle>
  quickReplyTextStyle?: StyleProp<TextStyle>
  quickReplyContainerStyle?: StyleProp<ViewStyle>
  /* optional prop used to place customView below text, image and video views; default is false */
  isCustomViewBottom?: boolean
  timeTextStyle?: LeftRightStyle<TextStyle>
  /* Custom action sheet */
  actionSheet?: () => {
    showActionSheetWithOptions: (
      options: ActionSheetOptions,
      callback: (buttonIndex: number) => void | Promise<void>,
    ) => void
  }
  /* Callback when a message avatar is tapped */
  onPressAvatar?: (user: User) => void
  /* Callback when a message avatar is tapped */
  onLongPressAvatar?: (user: User) => void
  /* Generate an id for new messages. Defaults to a simple random string generator */
  messageIdGenerator?: (message?: TMessage) => string
  /* Callback when sending a message */
  onSend?: (messages: TMessage[]) => void
  /*  Render a loading view when initializing */
  renderLoading?: () => React.ReactNode
  /* Custom message avatar; set to null to not render any avatar for the message */
  renderAvatar?: null | ((props: AvatarProps<TMessage>) => React.ReactNode)
  /* Custom message bubble */
  renderBubble?: (props: BubbleProps<TMessage>) => React.ReactNode
  /* Custom system message */
  renderSystemMessage?: (props: SystemMessageProps<TMessage>) => React.ReactNode
  /* Callback when a message bubble is pressed; default is to do nothing */
  onPressMessage?: (context: unknown, message: TMessage) => void
  /* Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see example using showActionSheetWithOptions()) */
  onLongPressMessage?: (context: unknown, message: TMessage) => void
  /* Custom Username container */
  renderUsername?: (user: User) => React.ReactNode
  /* Reverses display order of messages; default is true */
  /* Custom message text */
  renderMessageText?: (messageText: MessageTextProps<TMessage>) => React.ReactNode
  /* Custom message image */
  renderMessageImage?: (props: MessageImageProps<TMessage>) => React.ReactNode
  /* Custom message video */
  renderMessageVideo?: (props: MessageVideoProps<TMessage>) => React.ReactNode
  /* Custom message audio */
  renderMessageAudio?: (props: MessageAudioProps<TMessage>) => React.ReactNode
  /* Custom view inside the bubble */
  renderCustomView?: (props: BubbleProps<TMessage>) => React.ReactNode
  /* Custom time inside a message */
  renderTime?: (props: TimeProps<TMessage>) => React.ReactNode
  /* Custom component to render below the MessagesContainer */
  renderChatFooter?: () => React.ReactNode
  /* Custom message composer container. Can be a component, element, render function, or null */
  renderInputToolbar?: React.ComponentType<InputToolbarProps<TMessage>> | React.ReactElement | ((props: InputToolbarProps<TMessage>) => React.ReactNode) | null
  /*  Custom text input message composer */
  renderComposer?: (props: ComposerProps) => React.ReactNode
  /* Custom action button on the left of the message composer */
  renderActions?: (props: ActionsProps) => React.ReactNode
  /* Custom send button; you can pass children to the original Send component quite easily, for example to use a custom icon (example) */
  renderSend?: (props: SendProps<TMessage>) => React.ReactNode
  /* Custom second line of actions below the message composer */
  renderAccessory?: (props: InputToolbarProps<TMessage>) => React.ReactNode
  /* Callback when the Action button is pressed (if set, the default actionSheet will not be used) */
  onPressActionButton?: () => void
  /* Extra props to be passed to the MessageText component */
  messageTextProps?: Partial<MessageTextProps<TMessage>>
  renderQuickReplies?: (
    quickReplies: QuickRepliesProps<TMessage>,
  ) => React.ReactNode
  renderQuickReplySend?: () => React.ReactNode
  keyboardProviderProps?: React.ComponentProps<typeof KeyboardProvider>
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps
  /** Enable animated day label that appears on scroll; default is true */
  isDayAnimationEnabled?: boolean
}
