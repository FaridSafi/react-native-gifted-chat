import React, { useCallback } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import type { CustomViewProps } from './types'
import { styles } from './styles'

const CustomView = ({
  currentMessage,
  containerStyle,
}: CustomViewProps) => {
  const openMapAsync = useCallback(async () => {
    alert('Opening the map is not supported.')
  }, [])

  if (currentMessage.location)
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={openMapAsync}
      >
        <View style={{ padding: 15 }}>
          <Text style={{ color: 'tomato', fontWeight: 'bold' }}>
            Map not supported in web yet, sorry!
          </Text>
        </View>
      </TouchableOpacity>
    )

  return null
}

export default CustomView
