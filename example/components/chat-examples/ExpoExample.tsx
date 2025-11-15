import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import AccessoryBar from '../../example-expo/AccessoryBar'
import CustomActions from '../../example-expo/CustomActions'
import CustomView from '../../example-expo/CustomView'
import earlierMessages from '../../example-expo/data/earlierMessages'
import messagesData from '../../example-expo/data/messages'

export default function ExpoExample () {
  const [messages, setMessages] = useState<IMessage[]>(messagesData)
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    )
  }, [])

  const onLoadEarlier = useCallback(() => {
    setIsLoadingEarlier(true)
    setTimeout(() => {
      setMessages(previousMessages =>
        GiftedChat.prepend(previousMessages, earlierMessages)
      )
      setIsLoadingEarlier(false)
    }, 1500)
  }, [])

  const renderAccessory = useCallback(
    () => <AccessoryBar onSend={onSend} isTyping={() => setIsTyping(!isTyping)} />,
    [onSend, isTyping]
  )

  const renderCustomView = useCallback((props: any) => <CustomView {...props} />, [])

  const renderActions = useCallback(
    (props: any) => <CustomActions {...props} onSend={onSend} />,
    [onSend]
  )

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        loadEarlier
        isLoadingEarlier={isLoadingEarlier}
        onLoadEarlier={onLoadEarlier}
        user={{
          _id: 1,
          name: 'Developer',
        }}
        renderActions={renderActions}
        renderAccessory={renderAccessory}
        renderCustomView={renderCustomView}
        isTyping={isTyping}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
