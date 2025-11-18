import { StyleSheet } from 'react-native'
import { Image } from 'expo-image'

import { ExternalLink } from '@/components/external-link'
import { HelloWave } from '@/components/hello-wave'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function HomeScreen () {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>React Native Gifted Chat</ThemedText>
        <ThemedText>
          The most complete chat UI for React Native
        </ThemedText>
        <ExternalLink href='https://github.com/FaridSafi/react-native-gifted-chat'>
          <ThemedText type='link'>View on GitHub</ThemedText>
        </ExternalLink>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          Tap the Explore tab to try different chat examples.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
