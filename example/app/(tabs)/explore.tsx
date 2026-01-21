import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'

type ChatExample = 'basic' | 'customized-rendering' | 'slack' | 'links' | 'reply'

const examples: Array<{ id: ChatExample, title: string, description: string }> = [
  { id: 'basic', title: 'Basic Example', description: 'Basic chat with keyboard logging for testing' },
  { id: 'links', title: 'Links & Patterns', description: 'Phone numbers, emails, URLs, hashtags, and mentions' },
  { id: 'customized-rendering', title: 'Customized Rendering', description: 'Customized chat with all rendering options' },
  { id: 'slack', title: 'Slack Style', description: 'Slack-like message styling' },
  { id: 'reply', title: 'Reply Example', description: 'Example demonstrating reply functionality' },
]

export default function ExploreScreen () {
  const router = useRouter()
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#444' }, 'icon')

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor }]} edges={['top']}>
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
              onPress={() => router.push(`/chat/${example.id}`)}
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
})
