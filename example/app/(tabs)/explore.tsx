import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'

import ExpoExample from '@/components/chat-examples/ExpoExample'
import GiftedChatExample from '@/components/chat-examples/GiftedChatExample'
import SlackExample from '@/components/chat-examples/SlackExample'
import LinksExample from '@/components/chat-examples/LinksExample'

type ChatExample = 'expo' | 'gifted' | 'slack' | 'links'

const examples = [
  { id: 'expo' as ChatExample, title: 'Expo Example', description: 'Full featured example with custom actions, accessories, and media' },
  { id: 'gifted' as ChatExample, title: 'Gifted Chat', description: 'Customized chat with all rendering options' },
  { id: 'slack' as ChatExample, title: 'Slack Style', description: 'Slack-like message styling' },
  { id: 'links' as ChatExample, title: 'Links & Patterns', description: 'Phone numbers, emails, URLs, hashtags, and mentions' },
]

export default function ExploreScreen () {
  const [selectedExample, setSelectedExample] = useState<ChatExample | null>(null)
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#444' }, 'icon')

  let selectedExampleContent
  if (selectedExample)
    selectedExampleContent = (
      <>
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={() => setSelectedExample(null)} style={styles.backButton}>
            <ThemedText type='link'>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText type='subtitle'>
            {examples.find(e => e.id === selectedExample)?.title}
          </ThemedText>
        </View>
        <View style={styles.chatContainer}>
          {selectedExample === 'expo' && <ExpoExample />}
          {selectedExample === 'gifted' && <GiftedChatExample />}
          {selectedExample === 'slack' && <SlackExample />}
          {selectedExample === 'links' && <LinksExample />}
        </View>
      </>
    )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'left', 'right']}>
      {
        selectedExampleContent
          ? selectedExampleContent
          : (
            <ScrollView style={styles.scrollView}>
              <ThemedView style={styles.titleContainer}>
                <ThemedText type='title'>Explore Chat Examples</ThemedText>
              </ThemedView>
              <ThemedView style={styles.description}>
                <ThemedText>
                  Choose from different chat implementations to see various features and styling options.
                </ThemedText>
              </ThemedView>
              <View style={styles.examplesContainer}>
                {examples.map(example => (
                  <TouchableOpacity
                    key={example.id}
                    style={[styles.exampleCard, { borderColor }]}
                    onPress={() => setSelectedExample(example.id)}
                  >
                    <ThemedText type='subtitle' style={styles.exampleTitle}>
                      {example.title}
                    </ThemedText>
                    <ThemedText style={styles.exampleDescription}>
                      {example.description}
                    </ThemedText>
                    <ThemedText type='link' style={styles.tryButton}>
                      Try it →
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  description: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  examplesContainer: {
    padding: 20,
    gap: 15,
  },
  exampleCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  exampleTitle: {
    marginBottom: 4,
  },
  exampleDescription: {
    opacity: 0.7,
    marginBottom: 8,
  },
  tryButton: {
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    gap: 15,
  },
  backButton: {
    padding: 5,
  },
  chatContainer: {
    flex: 1,
  },
})
