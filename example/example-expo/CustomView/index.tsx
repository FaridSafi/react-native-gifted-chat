import React, { useCallback } from 'react'
import { Platform, View, Text } from 'react-native'
import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import { RectButton } from 'react-native-gesture-handler'
import MapView from 'react-native-maps'
import commonStyles from '../../styles'
import styles from './styles'
import type { CustomViewProps } from './types'

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

    const { location } = currentMessage

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

  if (currentMessage.location) {
    // Check if Google Maps API key is configured for Android
    const androidApiKey = Constants.expoConfig?.android?.config?.googleMaps?.apiKey
    const hasAndroidApiKey = androidApiKey && androidApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY'
    const shouldShowPlaceholder = Platform.OS === 'android' && !hasAndroidApiKey

    // Use native MapView for iOS or Android with API key
    return (
      <RectButton
        style={containerStyle}
        onPress={openMapAsync}
      >
        {
          shouldShowPlaceholder
            ? (
              <View style={[commonStyles.center, styles.mapView, mapViewStyle]}>
                <Text style={commonStyles.textCenter}>Google Maps API key is not configured.</Text>
              </View>
            ) : (
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
            )
        }
      </RectButton>
    )
  }

  return null
}

export default CustomView
