import * as Linking from 'expo-linking'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  View,
  Text,
} from 'react-native'
import MapView from 'react-native-maps'

export default class CustomView extends React.Component<{
  currentMessage: any
  containerStyle: any
  mapViewStyle: any
}> {
  static propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    mapViewStyle: ViewPropTypes.style,
  }

  static defaultProps = {
    currentMessage: {},
    containerStyle: {},
    mapViewStyle: {},
  }

  openMapAsync = async () => {
    if (Platform.OS === 'web') {
      alert('Opening the map is not supported.')
      return
    }
    const { currentMessage: { location = {} } = {} } = this.props

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
    } catch ({ message }) {
      alert(message)
    }
  }

  render() {
    const { currentMessage, containerStyle, mapViewStyle } = this.props
    if (currentMessage.location) {
      return (
        <TouchableOpacity
          style={[styles.container, containerStyle]}
          onPress={this.openMapAsync}
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
}

const styles = StyleSheet.create({
  container: {},
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
})
