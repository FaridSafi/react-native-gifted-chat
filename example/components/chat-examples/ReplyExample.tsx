import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, StyleSheet, Text, View, useColorScheme } from 'react-native'
import { GiftedChat, IMessage, InputToolbar } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import messagesData from '../../example-expo/data/messages'
import { getColorSchemeStyle } from '../../utils/styleUtils'
import ReplyMessage from '@/example-reply/src/ReplyMessage'
import Animated, { Easing, ReduceMotion, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { ThemedText } from '../themed-text'
import ReplyBubble from '@/example-reply/src/ReplyBubble'

export interface IChatMessage extends IMessage {
  replyMessage?: {
    _id: string;
    text: string;
    userName: string;
  };
}

export default function ReplyExample () {
  const [messages, setMessages] = useState<IChatMessage[]>(messagesData)
  const [replyMessage, setReplyMessage] = useState<IChatMessage | null>(null)
  const textInputRef = React.useRef<any>(null)
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()

  const tabbarHeight = 50
  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 })
  const keyboardVerticalOffset = insets.bottom + tabbarHeight + keyboardTopToolbarHeight
  const replyHeight = useSharedValue(0);
  const replyOpacity = useSharedValue(0);

  const replyContainerAnimatedStyle = useAnimatedStyle(() => ({
    height: replyHeight.value,
    opacity: replyOpacity.value,
  }))

  const user = useMemo(() => ({
    _id: 1,
    name: 'Developer',
  }), [])

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    const messagesWithIds = newMessages.map(msg => ({
      ...msg,
      _id: msg._id || Math.random().toString(36).substring(7),
      user: msg.user || user,
      image: '1',
      
      replyMessage: replyMessage ? {
        _id: replyMessage._id.toString(),
        text: replyMessage.text,
        userName: replyMessage.user.name || 'Unknown',
      } : undefined,
    }))
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messagesWithIds)
    )

    if (replyMessage) {
      clearReplyMessage()
    }
  }, [user, replyMessage])

  const setReplyOnSwipeOpen = useCallback(
    (message: IMessage) => {
      setReplyMessage(message);

      textInputRef.current?.focus();
    },
    [],
  );

  const clearReplyMessage = useCallback(() => {
    replyOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
    replyHeight.value = withTiming(
      0,
      {
        duration: 200,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      },
      () => {
        runOnJS(setReplyMessage)(null);
      },
    );
  }, [replyHeight, replyOpacity]);


  useEffect(() => {
    if (replyMessage) {
      replyHeight.value = withTiming(64, {
        duration: 200,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });
      replyOpacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [replyMessage, replyHeight, replyOpacity]);

  return (
    <View style={[styles.container, getColorSchemeStyle(styles, 'container', colorScheme)]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        messagesContainerStyle={getColorSchemeStyle(styles, 'messagesContainer', colorScheme)}
        textInputProps={{
          style: getColorSchemeStyle(styles, 'composer', colorScheme),
        }}
        renderBubble={(props) => <ReplyBubble {...props} />}
        renderMessage={(props) => (
          <ReplyMessage
            setReplyOnSwipeOpen={setReplyOnSwipeOpen}
            rightActionContainerStyle={{
              width: 40,
              paddingBottom: 12,
            }}
            rightActionImageContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            {...props}
          />
        )}
        renderInputToolbar={(props) => (
          <View
            style={[
              {
                flexDirection: 'column',
                paddingTop: 8,
              },
            ]}>
               <Animated.View style={[replyContainerAnimatedStyle]}>
                {replyMessage && (
                  <View
                    style={[
                      styles.editContainer,
                    ]}>
                    <Entypo name="reply" size={20} color="#4c9aff" />
                    <View style={styles.editInnerContainer}>
                      <ThemedText numberOfLines={1}>
                        Reply
                        <ThemedText type="default" numberOfLines={1}>
                          {' '}
                          {replyMessage.user.name}
                        </ThemedText>
                      </ThemedText>
                      <ThemedText numberOfLines={1}>
                        {replyMessage.text}
                      </ThemedText>
                    </View>
                    <AntDesign
                      name="close"
                      size={24}
                      color="black"
                      onPress={() => {
                        clearReplyMessage();
                        textInputRef.current?.clear()
                      }}
                    />
                  </View>
                )}
              </Animated.View>
              <InputToolbar {...props} />
            </View>
          )}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container_dark: {
    backgroundColor: '#000',
  },
  messagesContainer_dark: {
    backgroundColor: '#000',
  },
  composer_dark: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    columnGap: 8,
    padding: 4,
    marginBottom: 8,
  },
  editInnerContainer: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 4,
  },
})
