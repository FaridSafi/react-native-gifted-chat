import React, { RefObject } from 'react'
import {
  ActionSheetOptions,
} from '@expo/react-native-action-sheet'
import {
  TextInput,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { LightboxProps } from 'react-native-lightbox-v2'
import { ActionsProps } from '../Actions'
import { AvatarProps } from '../Avatar'
import { ComposerProps } from '../Composer'
import { DayProps } from '../Day'
import { InputToolbarProps } from '../InputToolbar'
import { LoadEarlierProps } from '../LoadEarlier'
import { MessageProps } from '../Message'
import { MessageImageProps } from '../MessageImage'
import { MessageTextProps } from '../MessageText'
import {
  IMessage,
  LeftRightStyle,
  MessageAudioProps,
  MessageVideoProps,
  Reply,
  User,
} from '../types'
import { QuickRepliesProps } from '../QuickReplies'
import { SendProps } from '../Send'
import { SystemMessageProps } from '../SystemMessage'
import { TimeProps } from '../Time'
import { AnimatedList, ListViewProps, MessageContainerProps } from '../MessageContainer'
import { BubbleProps } from '../Bubble'

export interface GiftedChatProps<TMessage extends IMessage> extends Partial<MessageContainerProps<TMessage>> {
  /* Message container ref */
  messageContainerRef?: RefObject<AnimatedList<TMessage>>
  /* text input ref */
  textInputRef?: RefObject<TextInput>
  /* Messages to display */
  messages?: TMessage[]
  /* Typing Indicator state */
  isTyping?: boolean
  /* Controls whether or not to show user.name property in the message bubble */
  renderUsernameOnMessage?: boolean
  /* Messages container style */
  messagesContainerStyle?: StyleProp<ViewStyle>
  /* Input text; default is undefined, but if specified, it will override GiftedChat's internal state */
  text?: string
  /* Controls whether or not the message bubbles appear at the top of the chat */
  alignTop?: boolean
  /* enables the isScrollToBottomEnabled Component */
  isScrollToBottomEnabled?: boolean
  /* Scroll to bottom wrapper style */
  scrollToBottomStyle?: StyleProp<ViewStyle>
  initialText?: string
  /* Placeholder when text is empty; default is 'Type a message...' */
  placeholder?: string
  /* Makes the composer not editable */
  disableComposer?: boolean
  /* User sending the messages: { _id, name, avatar } */
  user?: User
  /*  Locale to localize the dates */
  locale?: string
  /* Format to use for rendering times; default is 'LT' */
  timeFormat?: string
  /* Format to use for rendering dates; default is 'll' */
  dateFormat?: string
  /* Format to use for rendering relative times; Today - for now. See more: https://day.js.org/docs/en/plugin/calendar */
  dateFormatCalendar?: object
  /* Enables the "Load earlier messages" button */
  loadEarlier?: boolean
  /* Display an ActivityIndicator when loading earlier messages */
  isLoadingEarlier?: boolean
  /* Determine whether to handle keyboard awareness inside the plugin. If you have your own keyboard handling outside the plugin set this to false; default is `true` */
  isKeyboardInternallyHandled?: boolean
  /* Whether to render an avatar for the current user; default is false, only show avatars for other users */
  showUserAvatar?: boolean
  /* When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is false */
  showAvatarForEveryMessage?: boolean
  /* Render the message avatar at the top of consecutive messages, rather than the bottom; default is false */
  renderAvatarOnTop?: boolean
  inverted?: boolean
  /* Extra props to be passed to the <Image> component created by the default renderMessageImage */
  imageProps?: MessageImageProps<TMessage>
  /* Extra props to be passed to the MessageImage's Lightbox */
  lightboxProps?: LightboxProps
  /* Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar); default is 0 */
  bottomOffset?: number
  /* Focus on <TextInput> automatically when opening the keyboard; default is true */
  focusOnInputWhenOpeningKeyboard?: boolean
  /* Minimum height of the input toolbar; default is 44 */
  minInputToolbarHeight?: number
  /* Extra props to be passed to the messages <ListView>; some props can't be overridden, see the code in MessageContainer.render() for details */
  listViewProps?: ListViewProps
  /*  Extra props to be passed to the <TextInput> */
  textInputProps?: object
  /* Determines whether the keyboard should stay visible after a tap; see <ScrollView> docs */
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled'
  /* Max message composer TextInput length */
  maxInputLength?: number
  /* Force send button */
  alwaysShowSend?: boolean
  /* Image style */
  imageStyle?: StyleProp<ViewStyle>
  /* This can be used to pass unknown data which needs to be re-rendered */
  extraData?: object
  /* composer min Height */
  minComposerHeight?: number
  /* composer min Height */
  maxComposerHeight?: number
  options?: { [key: string]: () => void }
  optionTintColor?: string
  quickReplyStyle?: StyleProp<ViewStyle>
  quickReplyTextStyle?: StyleProp<TextStyle>
  quickReplyContainerStyle?: StyleProp<ViewStyle>
  /* optional prop used to place customView below text, image and video views; default is false */
  isCustomViewBottom?: boolean
  /* infinite scroll up when reach the top of messages container, automatically call onLoadEarlier function if exist */
  infiniteScroll?: boolean
  timeTextStyle?: LeftRightStyle<TextStyle>
  /* Custom action sheet */
  actionSheet?(): {
    showActionSheetWithOptions: (
      options: ActionSheetOptions,
      callback: (buttonIndex: number) => void | Promise<void>,
    ) => void
  }
  /* Callback when a message avatar is tapped */
  onPressAvatar?(user: User): void
  /* Callback when a message avatar is tapped */
  onLongPressAvatar?(user: User): void
  /* Generate an id for new messages. Defaults to UUID v4, generated by uuid */
  messageIdGenerator?(message?: TMessage): string
  /* Callback when sending a message */
  onSend?(messages: TMessage[]): void
  /* Callback when loading earlier messages */
  onLoadEarlier?(): void
  /*  Render a loading view when initializing */
  renderLoading?(): React.ReactNode
  /* Custom "Load earlier messages" button */
  renderLoadEarlier?(props: LoadEarlierProps): React.ReactNode
  /* Custom message avatar; set to null to not render any avatar for the message */
  renderAvatar?: null | ((props: AvatarProps<TMessage>) => React.ReactNode)
  /* Custom message bubble */
  renderBubble?(props: BubbleProps<TMessage>): React.ReactNode
  /* Custom system message */
  renderSystemMessage?(props: SystemMessageProps<TMessage>): React.ReactNode
  /* Callback when a message bubble is pressed; default is to do nothing */
  onPress?(context: unknown, message: TMessage): void
  /* Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see example using showActionSheetWithOptions()) */
  onLongPress?(context: unknown, message: TMessage): void
  /* Custom Username container */
  renderUsername?(user: User): React.ReactNode
  /* Reverses display order of messages; default is true */
  /* Custom message container */
  renderMessage?(message: MessageProps<TMessage>): React.ReactElement
  /* Custom message text */
  renderMessageText?(messageText: MessageTextProps<TMessage>): React.ReactNode
  /* Custom message image */
  renderMessageImage?(props: MessageImageProps<TMessage>): React.ReactNode
  /* Custom message video */
  renderMessageVideo?(props: MessageVideoProps<TMessage>): React.ReactNode
  /* Custom message video */
  renderMessageAudio?(props: MessageAudioProps<TMessage>): React.ReactNode
  /* Custom view inside the bubble */
  renderCustomView?(props: BubbleProps<TMessage>): React.ReactNode
  /* Custom day above a message */
  renderDay?(props: DayProps): React.ReactNode
  /* Custom time inside a message */
  renderTime?(props: TimeProps<TMessage>): React.ReactNode
  /* Custom footer component on the ListView, e.g. 'User is typing...' */
  renderFooter?(props: MessageContainerProps<TMessage>): React.ReactNode
  /* Custom component to render in the ListView when messages are empty */
  renderChatEmpty?(): React.ReactNode
  /* Custom component to render below the MessageContainer (separate from the ListView) */
  renderChatFooter?(): React.ReactNode
  /* Custom message composer container */
  renderInputToolbar?(props: InputToolbarProps<TMessage>): React.ReactNode
  /*  Custom text input message composer */
  renderComposer?(props: ComposerProps): React.ReactNode
  /* Custom action button on the left of the message composer */
  renderActions?(props: ActionsProps): React.ReactNode
  /* Custom send button; you can pass children to the original Send component quite easily, for example to use a custom icon (example) */
  renderSend?(props: SendProps<TMessage>): React.ReactNode
  /* Custom second line of actions below the message composer */
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode
  /* Callback when the Action button is pressed (if set, the default actionSheet will not be used) */
  onPressActionButton?(): void
  /* Callback when the input text changes */
  onInputTextChanged?(text: string): void
  /* Custom parse patterns for react-native-parsed-text used to linking message content (like URLs and phone numbers) */
  parsePatterns?: (linkStyle?: TextStyle) => { type?: string, pattern?: RegExp, style?: StyleProp<TextStyle> | object, onPress?: unknown, renderText?: unknown }[]
  onQuickReply?(replies: Reply[]): void
  renderQuickReplies?(
    quickReplies: QuickRepliesProps<TMessage>,
  ): React.ReactNode
  renderQuickReplySend?(): React.ReactNode
  /* Scroll to bottom custom component */
  scrollToBottomComponent?(): React.ReactNode
  shouldUpdateMessage?(
    props: MessageProps<TMessage>,
    nextProps: MessageProps<TMessage>,
  ): boolean
}
