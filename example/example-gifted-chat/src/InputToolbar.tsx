import React from 'react'
import { Image, useColorScheme } from 'react-native'
import {
  InputToolbar,
  Actions,
  Composer,
  Send,
  IMessage,
  InputToolbarProps,
  ActionsProps,
  ComposerProps,
  SendProps,
} from 'react-native-gifted-chat'

export const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: isDark ? '#1a1a1a' : '#222B45',
        paddingTop: 6,
      }}
      primaryStyle={{ alignItems: 'center' }}
    />
  )
}

export const renderActions = (props: ActionsProps) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      icon={() => (
        <Image
          style={{ width: 32, height: 32 }}
          source={{
            uri: 'https://placeimg.com/32/32/any',
          }}
        />
      )}
      options={{
        'Choose From Library': () => {
          console.log('Choose From Library')
        },
        Cancel: () => {
          console.log('Cancel')
        },
      }}
      optionTintColor={isDark ? '#ffffff' : '#222B45'}
    />
  )
}

export const renderComposer = (props: ComposerProps) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Composer
      {...props}
      textInputProps={{
        style: {
          color: isDark ? '#ffffff' : '#222B45',
          backgroundColor: isDark ? '#2a2a2a' : '#EDF1F7',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: isDark ? '#3a3a3a' : '#E4E9F2',
          paddingTop: 8.5,
          paddingHorizontal: 12,
          marginLeft: 0,
        },
        placeholderTextColor: isDark ? '#888' : undefined,
      }}
    />
  )
}

export const renderSend = (props: SendProps<IMessage>) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}
  >
    <Image
      style={{ width: 32, height: 32 }}
      source={{
        uri: 'https://placeimg.com/32/32/any',
      }}
    />
  </Send>
)
