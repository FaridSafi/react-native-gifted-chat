import React from 'react'
import { View, Text } from 'react-native'
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
  IMessage,
  User,
  AvatarProps,
  BubbleProps,
  SystemMessageProps,
  MessageProps,
  MessageTextProps,
} from 'react-native-gifted-chat'

export const renderAvatar = (props: AvatarProps<IMessage>) => (
  <Avatar
    {...props}
    containerStyle={{ left: { borderWidth: 3, borderColor: 'red' } }}
    imageStyle={{ left: { borderWidth: 3, borderColor: 'blue' } }}
  />
)

export const renderBubble = (props: BubbleProps<IMessage>) => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>}
    containerStyle={{
      left: { borderColor: 'teal', borderWidth: 8 },
    }}
    wrapperStyle={{
      left: { borderColor: 'tomato', borderWidth: 4 },
    }}
    bottomContainerStyle={{
      left: { borderColor: 'purple', borderWidth: 4 },
    }}
    usernameStyle={{ color: 'tomato', fontWeight: '100' }}
    containerToNextStyle={{
      left: { borderColor: 'navy', borderWidth: 4 },
    }}
    containerToPreviousStyle={{
      left: { borderColor: 'mediumorchid', borderWidth: 4 },
    }}
  />
)

export const renderSystemMessage = (props: SystemMessageProps<IMessage>) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'pink' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
    textStyle={{ color: 'crimson', fontWeight: '900' }}
  />
)

export const renderMessage = (props: MessageProps<IMessage>) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: 'lime' },
      right: { backgroundColor: 'gold' },
    }}
  />
)

export const renderMessageText = (props: MessageTextProps<IMessage>) => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: 'yellow' },
      right: { backgroundColor: 'purple' },
    }}
    textStyle={{
      left: { color: 'red' },
      right: { color: 'green' },
    }}
    linkStyle={{
      left: { color: 'orange' },
      right: { color: 'orange' },
    }}
    customTextStyle={{ fontSize: 24, lineHeight: 24 }}
  />
)

interface CustomViewProps {
  user: User
}

export const renderCustomView = ({ user }: CustomViewProps) => (
  <View style={{ minHeight: 20, alignItems: 'center' }}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
)
