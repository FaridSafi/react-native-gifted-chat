import React, { useCallback } from 'react'
import {
  View,
  Text,
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { styles } from './styles'
import type { CustomViewProps } from './types'

const CustomView = ({
  currentMessage,
  containerStyle,
}: CustomViewProps) => {
  const openMapAsync = useCallback(async () => {
    alert('Opening the map is not supported.')
  }, [])

  if (currentMessage.location)
    return (
      <RectButton
        style={[styles.container, containerStyle]}
        onPress={openMapAsync}
      >
        <View style={{ padding: 15 }}>
          <Text style={{ color: 'tomato', fontWeight: 'bold' }}>
            Map not supported in web yet, sorry!
          </Text>
        </View>
      </RectButton>
    )

  return null
}

export default CustomView
