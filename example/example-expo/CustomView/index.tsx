import React, { useCallback } from 'react'
import * as Linking from 'expo-linking'
import {
  Platform,
  TouchableOpacity,
} from 'react-native'
import MapView from 'react-native-maps'
import type { CustomViewProps } from './types'
import { styles } from './styles'

const CustomView = ({
  currentMessage,
  containerStyle,
  mapViewStyle,
}: CustomViewProps) => {
  const openMapAsync = useCallback(async () => {
    if (Platform.OS === 'web') {
      alert('Opening the map is not supported.')
      return
    }

    const { location = {} } = currentMessage

    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${location.latitude},${location.longitude}`,
      default: `http://maps.google.com/?q=${location.latitude},${location.longitude}`,
    })

    try {
      const supported = await Linking.canOpenURL(url)
      if (supported)
        return Linking.openURL(url)

      alert('Opening the map is not supported.')
    } catch (e) {
      alert(e.message)
    }
  }, [currentMessage])

  if (currentMessage.location)
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={openMapAsync}
      >
        <MapView
          style={[styles.mapView, mapViewStyle]}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      </TouchableOpacity>
    )

  return null
}

export default CustomView
