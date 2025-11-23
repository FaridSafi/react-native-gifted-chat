import React, { useCallback } from 'react'
import {
  View,
  Text,
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import styles from './styles'
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
      <RectButton onPress={openMapAsync}>
        <View style={[styles.mapView, containerStyle]}>
          <Text style={styles.text}>
            Maps are not supported on web, sorry!
          </Text>
        </View>
      </RectButton>
    )

  return null
}

export default CustomView
