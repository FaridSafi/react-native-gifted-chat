import React, { useCallback, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native'
import { Bubble, BubbleProps, GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useKeyboardVerticalOffset } from '../../hooks/useKeyboardVerticalOffset'
import { getColorSchemeStyle } from '../../utils/styleUtils'

type AlignMode = 'bottom' | 'top' | 'auto'

const ALIGN_MODES: Array<{ id: AlignMode, label: string }> = [
  { id: 'bottom', label: 'false' },
  { id: 'top', label: 'true' },
  { id: 'auto', label: '\'auto\'' },
]

const BOT = { _id: 2, name: 'Bot' }

const INITIAL_MESSAGES: IMessage[] = [
  {
    _id: 3,
    text: 'Open the keyboard: with auto the conversation re-anchors to the bottom, and drops back to the top when you dismiss it.',
    createdAt: new Date(),
    user: BOT,
  },
  {
    _id: 2,
    text: 'A short conversation like this one does not fill the screen.',
    createdAt: new Date(),
    user: BOT,
  },
  {
    _id: 1,
    text: 'Hi! How can I help you?',
    createdAt: new Date(),
    user: BOT,
  },
]

export default function AlignedTopExample () {
  const [messages, setMessages] = useState<IMessage[]>(INITIAL_MESSAGES)
  const [alignMode, setAlignMode] = useState<AlignMode>('auto')
  const [isTallBubbleEnabled, setIsTallBubbleEnabled] = useState(false)
  const [isCustomToolbarEnabled, setIsCustomToolbarEnabled] = useState(false)
  const colorScheme = useColorScheme()

  // The chat starts below the navigation header and this screen's own toggle row, and
  // keyboardVerticalOffset is the distance from the top of the screen to the chat.
  const headerHeight = useKeyboardVerticalOffset()
  const [toggleRowHeight, setToggleRowHeight] = useState(0)
  const keyboardAvoidingViewProps = useMemo(
    () => ({ keyboardVerticalOffset: headerHeight + toggleRowHeight }),
    [headerHeight, toggleRowHeight]
  )

  const user = useMemo(() => ({ _id: 1, name: 'Developer' }), [])

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }, [])

  // Reproduces the bubble padding from
  // https://github.com/FaridSafi/react-native-gifted-chat/issues/2617 - three messages
  // are then taller than the list once the keyboard takes half the screen.
  const renderBubble = useCallback((props: BubbleProps<IMessage>) => (
    <Bubble {...props} wrapperStyle={{ left: styles.tallBubble, right: styles.tallBubble }} />
  ), [])

  // A toolbar that replaces GiftedChat's own, exactly as reported in
  // https://github.com/FaridSafi/react-native-gifted-chat/issues/2617 - its TextInput is
  // the app's, not the Composer, so it never reports its height back to the chat.
  const renderInputToolbar = useCallback(() => (
    <View style={styles.customToolbar}>
      <TextInput placeholder='Custom toolbar...' placeholderTextColor='#888' style={styles.customInput} />
    </View>
  ), [])

  const isAlignedTop = alignMode === 'auto' ? 'auto' : alignMode === 'top'

  return (
    <View style={[styles.container, getColorSchemeStyle(styles, 'container', colorScheme)]}>
      <View style={styles.toolbar} onLayout={e => setToggleRowHeight(e.nativeEvent.layout.height)}>
        <Text style={[styles.toolbarLabel, getColorSchemeStyle(styles, 'toolbarLabel', colorScheme)]}>
          isAlignedTop
        </Text>
        {ALIGN_MODES.map(mode => (
          <Pressable
            key={mode.id}
            onPress={() => setAlignMode(mode.id)}
            style={[styles.chip, alignMode === mode.id && styles.chipActive]}
          >
            <Text style={[styles.chipText, alignMode === mode.id && styles.chipTextActive]}>
              {mode.label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setIsTallBubbleEnabled(value => !value)}
          style={[styles.chip, isTallBubbleEnabled && styles.chipActive]}
        >
          <Text style={[styles.chipText, isTallBubbleEnabled && styles.chipTextActive]}>
            {'tall'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setIsCustomToolbarEnabled(value => !value)}
          style={[styles.chip, isCustomToolbarEnabled && styles.chipActive]}
        >
          <Text style={[styles.chipText, isCustomToolbarEnabled && styles.chipTextActive]}>
            {'custom bar'}
          </Text>
        </Pressable>
      </View>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        isAlignedTop={isAlignedTop}
        keyboardAvoidingViewProps={keyboardAvoidingViewProps}
        renderBubble={isTallBubbleEnabled ? renderBubble : undefined}
        renderInputToolbar={isCustomToolbarEnabled ? renderInputToolbar : undefined}
        messagesContainerStyle={getColorSchemeStyle(styles, 'messagesContainer', colorScheme)}
        textInputProps={{ style: getColorSchemeStyle(styles, 'composer', colorScheme) }}
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toolbarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  toolbarLabel_dark: {
    color: '#eee',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#e6e6e6',
  },
  chipActive: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 13,
    color: '#333',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tallBubble: {
    paddingVertical: 64,
  },
  customToolbar: {
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#888',
  },
  customInput: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: '#8883',
    color: '#888',
  },
})
