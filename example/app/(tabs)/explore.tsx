import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

import CustomizedFeaturesExample from '@/components/chat-examples/CustomizedFeaturesExample'
import CustomizedRenderingExample from '@/components/chat-examples/CustomizedRenderingExample'
import LinksExample from '@/components/chat-examples/LinksExample'

import SlackExample from '@/components/chat-examples/SlackExample'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import ReplyExample from '@/components/chat-examples/ReplyExample'

type ChatExample = 'customizedFeatures' | 'customizedRendering' | 'slack' | 'links' | 'reply'

const examples: Array<{ id: ChatExample, title: string, description: string }> = [
  { id: 'customizedFeatures', title: 'Customized Features', description: 'Full featured example with custom actions, accessories, and media' },
  { id: 'links', title: 'Links & Patterns', description: 'Phone numbers, emails, URLs, hashtags, and mentions' },
  { id: 'customizedRendering', title: 'Customized Rendering', description: 'Customized chat with all rendering options' },
  { id: 'slack', title: 'Slack Style', description: 'Slack-like message styling' },
  { id: 'reply', title: 'Reply Example', description: 'Example demonstrating reply functionality' },
]

export default function ExploreScreen () {
  const [selectedExample, setSelectedExample] = useState<ChatExample>()
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#444' }, 'icon')

  let selectedExampleContent
  if (selectedExample)
    selectedExampleContent = (
      <>
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <RectButton onPress={() => setSelectedExample(undefined)} style={styles.backButton}>
            <ThemedText type='link'>← Back</ThemedText>
          </RectButton>
          <ThemedText type='subtitle'>
            {examples.find(e => e.id === selectedExample)?.title}
          </ThemedText>
        </View>
        <View style={styles.chatContainer}>
          {selectedExample === 'customizedFeatures' && <CustomizedFeaturesExample />}
          {selectedExample === 'customizedRendering' && <CustomizedRenderingExample />}
          {selectedExample === 'slack' && <SlackExample />}
          {selectedExample === 'links' && <LinksExample />}
          {selectedExample === 'reply' && <ReplyExample />}
        </View>
      </>
    )

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor }]} edges={['top', 'left', 'right']}>
      {
        selectedExampleContent
          ? selectedExampleContent
          : (
            <ScrollView style={styles.fill}>
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
                  <RectButton
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
                  </RectButton>
                ))}
              </View>
            </ScrollView>
          )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  fill: {
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
