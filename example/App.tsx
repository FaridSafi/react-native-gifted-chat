import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as Linking from 'expo-linking'
import AppLoading from 'expo-app-loading'
import React, { Component } from 'react'
import { StyleSheet, View, Text, Platform, Alert } from 'react-native'
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  IMessage,
  Send,
  SendProps,
} from 'react-native-gifted-chat'

import AccessoryBar from './example-expo/AccessoryBar'
import CustomActions from './example-expo/CustomActions'
import CustomView from './example-expo/CustomView'
import messagesData from './example-expo/data/messages'
import earlierMessages from './example-expo/data/earlierMessages'
import { NavBar } from './components/navbar'

const styles = StyleSheet.create({
  container: { flex: 1 },
})

const filterBotMessages = message =>
  !message.system && message.user && message.user._id && message.user._id === 2
const findStep = step => message => message._id === step

const user = {
  _id: 1,
  name: 'Developer',
}

const otherUser = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://facebook.github.io/react/img/logo_og.png',
}

export default class App extends Component {
  state = {
    inverted: false,
    step: 0,
    messages: [],
    loadEarlier: true,
    typingText: null,
    isLoadingEarlier: false,
    appIsReady: false,
    isTyping: false,
  }

  _isMounted = false

  componentDidMount() {
    this._isMounted = true
    // init with only system messages
    this.setState({
      messages: messagesData, // messagesData.filter(message => message.system),
      appIsReady: true,
      isTyping: false,
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  onLoadEarlier = () => {
    this.setState(() => {
      return {
        isLoadingEarlier: true,
      }
    })

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState: any) => {
          return {
            messages: GiftedChat.prepend(
              previousState.messages,
              earlierMessages() as IMessage[],
              Platform.OS !== 'web',
            ),
            loadEarlier: true,
            isLoadingEarlier: false,
          }
        })
      }
    }, 1500) // simulating network
  }

  onSend = (messages = []) => {
    const step = this.state.step + 1
    this.setState((previousState: any) => {
      const sentMessages = [{ ...messages[0], sent: true, received: true }]
      return {
        messages: GiftedChat.append(
          previousState.messages,
          sentMessages,
          Platform.OS !== 'web',
        ),
        step,
      }
    })
    // for demo purpose
    // setTimeout(() => this.botSend(step), Math.round(Math.random() * 1000))
  }

  botSend = (step = 0) => {
    const newMessage = (messagesData as IMessage[])
      .reverse()
      // .filter(filterBotMessages)
      .find(findStep(step))
    if (newMessage) {
      this.setState((previousState: any) => ({
        messages: GiftedChat.append(
          previousState.messages,
          [newMessage],
          Platform.OS !== 'web',
        ),
      }))
    }
  }

  parsePatterns = (_linkStyle: any) => {
    return [
      {
        pattern: /#(\w+)/,
        style: { textDecorationLine: 'underline', color: 'darkorange' },
        onPress: () => Linking.openURL('http://gifted.chat'),
      },
    ]
  }

  renderCustomView(props) {
    return <CustomView {...props} />
  }

  onReceive = (text: string) => {
    this.setState((previousState: any) => {
      return {
        messages: GiftedChat.append(
          previousState.messages as any,
          [
            {
              _id: Math.round(Math.random() * 1000000),
              text,
              createdAt: new Date(),
              user: otherUser,
            },
          ],
          Platform.OS !== 'web',
        ),
      }
    })
  }

  onSendFromUser = (messages: IMessage[] = []) => {
    const createdAt = new Date()
    const messagesToUpload = messages.map(message => ({
      ...message,
      user,
      createdAt,
      _id: Math.round(Math.random() * 1000000),
    }))
    this.onSend(messagesToUpload)
  }

  setIsTyping = () => {
    this.setState({
      isTyping: !this.state.isTyping,
    })
  }

  renderAccessory = () => (
    <AccessoryBar onSend={this.onSendFromUser} isTyping={this.setIsTyping} />
  )

  renderCustomActions = props =>
    Platform.OS === 'web' ? null : (
      <CustomActions {...props} onSend={this.onSendFromUser} />
    )

  renderBubble = (props: any) => {
    return <Bubble {...props} />
  }

  renderSystemMessage = props => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    )
  }

  onQuickReply = replies => {
    const createdAt = new Date()
    if (replies.length === 1) {
      this.onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user,
        },
      ])
    } else if (replies.length > 1) {
      this.onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map(reply => reply.title).join(', '),
          user,
        },
      ])
    } else {
      console.warn('replies param is not set correctly')
    }
  }

  renderQuickReplySend = () => <Text>{' custom send =>'}</Text>

  renderSend = (props: SendProps<IMessage>) => (
    <Send {...props} containerStyle={{ justifyContent: 'center' }}>
      <MaterialIcons size={30} color={'tomato'} name={'send'} />
    </Send>
  )

  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />
    }
    return (
      <View
        style={styles.container}
        accessible
        accessibilityLabel='main'
        testID='main'
      >
        <NavBar />
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}
          parsePatterns={this.parsePatterns}
          user={user}
          scrollToBottom
          onLongPressAvatar={user => alert(JSON.stringify(user))}
          onPressAvatar={() => alert('short press')}
          onPress={() => {
            Alert.alert('Bubble pressed')
          }}
          onQuickReply={this.onQuickReply}
          keyboardShouldPersistTaps='never'
          renderAccessory={Platform.OS === 'web' ? null : this.renderAccessory}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          renderSend={this.renderSend}
          quickReplyStyle={{ borderRadius: 2 }}
          quickReplyTextStyle={{
            fontWeight: '200',
          }}
          renderQuickReplySend={this.renderQuickReplySend}
          inverted={Platform.OS !== 'web'}
          timeTextStyle={{ left: { color: 'red' }, right: { color: 'yellow' } }}
          isTyping={this.state.isTyping}
          infiniteScroll
        />
      </View>
    )
  }
}
