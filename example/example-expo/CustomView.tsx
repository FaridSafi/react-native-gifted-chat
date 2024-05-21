import React, { useCallback } from 'react'
import * as Linking from 'expo-linking'
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native'
import MapView from 'react-native-maps'

interface Props {
  currentMessage: any
  containerStyle?: StyleProp<ViewStyle>
  mapViewStyle?: StyleProp<ViewStyle>
}

const CustomView = ({
  currentMessage,
  containerStyle,
  mapViewStyle,
}: Props) => {
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
      if (supported) {
        return Linking.openURL(url)
      }
      alert('Opening the map is not supported.')
    } catch (e) {
      alert(e.message)
    }
  }, [currentMessage])

  if (currentMessage.location) {
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={openMapAsync}
      >
        {Platform.OS !== 'web' ? (
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
        ) : (
          <View style={{ padding: 15 }}>
            <Text style={{ color: 'tomato', fontWeight: 'bold' }}>
              Map not supported in web yet, sorry!
            </Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return null
}

export default CustomView

const styles = StyleSheet.create({
  container: {},
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
})
