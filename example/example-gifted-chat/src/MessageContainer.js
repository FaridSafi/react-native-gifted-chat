import React from 'react'
import { View, Text } from 'react-native'
import { Avatar, Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat'

export const renderAvatar = props => (
  <Avatar
    {...props}
    containerStyle={{ left: { borderWidth: 3, borderColor: 'red' }, right: {} }}
    imageStyle={{ left: { borderWidth: 3, borderColor: 'blue' }, right: {} }}
  />
)

export const renderBubble = props => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>}
    containerStyle={{
      left: { borderColor: 'teal', borderWidth: 8 },
      right: {},
    }}
    wrapperStyle={{
      left: { borderColor: 'tomato', borderWidth: 4 },
      right: {},
    }}
    bottomContainerStyle={{
      left: { borderColor: 'purple', borderWidth: 4 },
      right: {},
    }}
    tickStyle={{}}
    usernameStyle={{ color: 'tomato', fontWeight: '100' }}
    containerToNextStyle={{
      left: { borderColor: 'navy', borderWidth: 4 },
      right: {},
    }}
    containerToPreviousStyle={{
      left: { borderColor: 'mediumorchid', borderWidth: 4 },
      right: {},
    }}
  />
)

export const renderSystemMessage = props => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'pink' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
    textStyle={{ color: 'crimson', fontWeight: '900' }}
  />
)

export const renderMessage = props => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: 'lime' },
      right: { backgroundColor: 'gold' },
    }}
  />
)

export const renderMessageText = props => (
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

export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: 'center' }}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
)
