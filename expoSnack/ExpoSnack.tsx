import React, { useCallback, useMemo, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native'
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet'
import { MaterialIcons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import * as ImagePicker from 'expo-image-picker'
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'
import { RectButton } from 'react-native-gesture-handler'
import { GiftedChat } from 'react-native-gifted-chat'
import type { IMessage, User } from 'react-native-gifted-chat'

// ============================================================================
// Helper Functions
// ============================================================================

function getColorSchemeStyle<T>(styles: T, baseName: string, colorScheme: string | null | undefined) {
  const key = `${baseName}_${colorScheme}` as keyof T
  return styles[key]
}

// ============================================================================
// Data
// ============================================================================

const date1 = dayjs()
const date2 = date1.clone().subtract(1, 'day')
const date3 = date2.clone().subtract(1, 'week')

const initialMessages: IMessage[] = [
  {
    _id: 9,
    text: '#awesome 3',
    createdAt: date1.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 8,
    text: '#awesome 2',
    createdAt: date1.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 7,
    text: '#awesome',
    createdAt: date1.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 6,
    text: 'Paris',
    createdAt: date2.toDate(),
    user: {
      _id: 2,
      name: 'React Native',
    },
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/003/407/768/small/eiffel-tower-at-paris-france-free-photo.jpg',
    sent: true,
    received: true,
  },
  {
    _id: 5,
    text: 'Send me a picture!',
    createdAt: date2.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 4,
    text: '',
    createdAt: date2.toDate(),
    user: {
      _id: 2,
      name: 'React Native',
    },
    sent: true,
    received: true,
    location: {
      latitude: 48.864601,
      longitude: 2.398704,
    },
  },
  {
    _id: 3,
    text: 'Where are you?',
    createdAt: date3.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 2,
    text: 'Yes, and I use #GiftedChat!',
    createdAt: date3.toDate(),
    user: {
      _id: 2,
      name: 'React Native',
    },
    sent: true,
    received: true,
  },
  {
    _id: 1,
    text: 'Are you building a chat app?',
    createdAt: date3.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 10,
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: date3.toDate(),
    quickReplies: {
      type: 'radio',
      keepIt: true,
      values: [
        {
          title: '😋 Yes',
          value: 'yes',
        },
        {
          title: '📷 Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: '😞 Nope. What?',
          value: 'no',
        },
      ],
    },
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 20,
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: date3.toDate(),
    quickReplies: {
      type: 'checkbox',
      values: [
        {
          title: 'Yes',
          value: 'yes',
        },
        {
          title: 'Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: 'Nope. What?',
          value: 'no',
        },
      ],
    },
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 30,
    text: '',
    createdAt: date3.toDate(),
    video: 'https://media.giphy.com/media/3o6ZthZjk09Xx4ktZ6/giphy.mp4',
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 31,
    text: '',
    createdAt: date3.toDate(),
    audio:
      'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3',
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
]

// Earlier messages for "Load Earlier" functionality
const getEarlierMessages = (): IMessage[] => {
  const date = dayjs().subtract(1, 'year')
  return [
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/',
      createdAt: date.toDate(),
      user: {
        _id: 1,
        name: 'Developer',
      },
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'React Native lets you build mobile apps using only JavaScript',
      createdAt: date.toDate(),
      user: {
        _id: 1,
        name: 'Developer',
      },
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'This is a system message.',
      createdAt: date.toDate(),
      system: true,
      user: {
        _id: 0,
      },
    },
  ]
}

// ============================================================================
// Media Utilities
// ============================================================================

async function getLocationAsync() {
  const response = await requestForegroundPermissionsAsync()
  if (!response.granted)
    return

  const location = await getCurrentPositionAsync()
  if (!location)
    return

  return location.coords
}

async function pickImageAsync() {
  const response = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!response.granted)
    return

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  })

  if (result.canceled)
    return

  return result.assets.map(({ uri }) => uri)
}

async function takePictureAsync() {
  const response = await ImagePicker.requestCameraPermissionsAsync()
  if (!response.granted)
    return

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
  })

  if (result.canceled)
    return

  return result.assets.map(({ uri }) => uri)
}

// ============================================================================
// Custom Actions Component
// ============================================================================

interface CustomActionsProps {
  renderIcon?: () => React.ReactNode
  wrapperStyle?: any
  containerStyle?: any
  iconTextStyle?: any
  onSend: (messages: IMessage[]) => void
  user: User
}

const CustomActions = ({
  renderIcon,
  iconTextStyle,
  containerStyle,
  wrapperStyle,
  onSend,
  user,
}: CustomActionsProps) => {
  const { showActionSheetWithOptions } = useActionSheet()
  const colorScheme = useColorScheme()

  const handlePickImage = useCallback(async () => {
    const images = await pickImageAsync()
    if (!images)
      return

    const messages: IMessage[] = images.map(image => ({
      _id: Math.random().toString(36).substring(7),
      image,
      text: '',
      createdAt: new Date(),
      user,
    }))
    onSend(messages)
  }, [onSend, user])

  const handleTakePicture = useCallback(async () => {
    const images = await takePictureAsync()
    if (!images)
      return

    const messages: IMessage[] = images.map(image => ({
      _id: Math.random().toString(36).substring(7),
      image,
      text: '',
      createdAt: new Date(),
      user,
    }))
    onSend(messages)
  }, [onSend, user])

  const handleSendLocation = useCallback(async () => {
    const location = await getLocationAsync()
    if (!location)
      return

    const message: IMessage = {
      _id: Math.random().toString(36).substring(7),
      location,
      text: '',
      createdAt: new Date(),
      user,
    }
    onSend([message])
  }, [onSend, user])

  const onActionsPress = useCallback(() => {
    const options: { title: string, action?: () => Promise<void> }[] = [
      { title: 'Choose From Library', action: handlePickImage },
      { title: 'Take Picture', action: handleTakePicture },
      { title: 'Send Location', action: handleSendLocation },
      { title: 'Cancel' },
    ]
    const cancelButtonIndex = options.length - 1

    showActionSheetWithOptions(
      {
        options: options.map(o => o.title),
        cancelButtonIndex,
      },
      async buttonIndex => {
        if (buttonIndex !== undefined) {
          const selectedOption = options[buttonIndex]
          selectedOption?.action?.()
        }
      }
    )
  }, [showActionSheetWithOptions, handlePickImage, handleTakePicture, handleSendLocation])

  const renderIconComponent = useCallback(() => {
    if (renderIcon)
      return renderIcon()

    const wrapperColorStyle = colorScheme === 'dark' ? customActionsStyles.wrapper_dark : {}
    const iconTextColorStyle = colorScheme === 'dark' ? customActionsStyles.iconText_dark : {}

    return (
      <View style={[customActionsStyles.wrapper, wrapperColorStyle, wrapperStyle]}>
        <Text style={[customActionsStyles.iconText, iconTextColorStyle, iconTextStyle]}>+</Text>
      </View>
    )
  }, [renderIcon, wrapperStyle, iconTextStyle, colorScheme])

  return (
    <RectButton style={[customActionsStyles.container, containerStyle]} onPress={onActionsPress}>
      {renderIconComponent()}
    </RectButton>
  )
}

const customActionsStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  wrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper_dark: {
    borderColor: '#666',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  iconText_dark: {
    color: '#999',
  },
})

// ============================================================================
// Accessory Bar Component
// ============================================================================

interface AccessoryBarProps {
  onSend: (messages: IMessage[]) => void
  isTyping: () => void
  user: User
}

const AccessoryBar = ({ onSend, isTyping, user }: AccessoryBarProps) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const handlePickImage = async () => {
    const images = await pickImageAsync()
    if (!images)
      return

    const messages: IMessage[] = images.map(image => ({
      _id: Math.random().toString(36).substring(7),
      image,
      text: '',
      createdAt: new Date(),
      user,
    }))
    onSend(messages)
  }

  const handleTakePicture = async () => {
    const images = await takePictureAsync()
    if (!images)
      return

    const messages: IMessage[] = images.map(image => ({
      _id: Math.random().toString(36).substring(7),
      image,
      text: '',
      createdAt: new Date(),
      user,
    }))
    onSend(messages)
  }

  const handleSendLocation = async () => {
    const location = await getLocationAsync()
    if (!location)
      return

    const message: IMessage = {
      _id: Math.random().toString(36).substring(7),
      location,
      text: '',
      createdAt: new Date(),
      user,
    }
    onSend([message])
  }

  const containerColorStyle = colorScheme === 'dark' ? accessoryBarStyles.container_dark : {}

  return (
    <View style={[accessoryBarStyles.container, containerColorStyle]}>
      <Button
        onPress={handlePickImage}
        name='photo'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
      <Button
        onPress={handleTakePicture}
        name='camera'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
      <Button
        onPress={handleSendLocation}
        name='my-location'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
      <Button
        onPress={() => {
          isTyping()
        }}
        name='chat'
        color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
      />
    </View>
  )
}

const Button = ({
  onPress,
  size = 30,
  color = 'rgba(0,0,0,0.5)',
  name,
}: {
  onPress: () => void
  size?: number
  color?: string
  name: React.ComponentProps<typeof MaterialIcons>['name']
}) => (
  <RectButton onPress={onPress}>
    <MaterialIcons size={size} color={color} name={name} />
  </RectButton>
)

const accessoryBarStyles = StyleSheet.create({
  container: {
    height: 44,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 5,
  },
  container_dark: {
    backgroundColor: '#1a1a1a',
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
})

// ============================================================================
// Main Chat Component
// ============================================================================

function ChatExample() {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages)
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const colorScheme = useColorScheme()

  const user = useMemo(
    () => ({
      _id: 1,
      name: 'Developer',
    }),
    []
  )

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      const messagesWithIds = newMessages.map(msg => ({
        ...msg,
        _id: msg._id || Math.random().toString(36).substring(7),
        user: msg.user || user,
      }))
      setMessages(previousMessages => GiftedChat.append(previousMessages, messagesWithIds))
    },
    [user]
  )

  const onPressLoadEarlierMessages = useCallback(() => {
    setIsLoadingEarlier(true)
    setTimeout(() => {
      setMessages(previousMessages => GiftedChat.prepend(previousMessages, getEarlierMessages()))
      setIsLoadingEarlier(false)
    }, 1500)
  }, [])

  const renderAccessory = useCallback(
    () => <AccessoryBar onSend={onSend} isTyping={() => setIsTyping(isTyping => !isTyping)} user={user} />,
    [onSend, user]
  )

  const renderActions = useCallback(
    (props: any) => <CustomActions {...props} onSend={onSend} user={user} />,
    [onSend, user]
  )

  return (
    <View style={[styles.container, getColorSchemeStyle(styles, 'container', colorScheme)]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        loadEarlierMessagesProps={{
          isAvailable: true,
          isLoading: isLoadingEarlier,
          onPress: onPressLoadEarlierMessages,
        }}
        user={user}
        renderActions={renderActions}
        renderAccessory={renderAccessory}
        isTyping={isTyping}
        messagesContainerStyle={getColorSchemeStyle(styles, 'messagesContainer', colorScheme)}
        textInputProps={{
          style: getColorSchemeStyle(styles, 'composer', colorScheme),
          outlineStyle: 'none',
        }}
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
})

// ============================================================================
// App Export (wrapped with ActionSheetProvider)
// ============================================================================

export default function App() {
  return (
    <ActionSheetProvider>
      <ChatExample />
    </ActionSheetProvider>
  )
}
