import React, { Component } from 'react';
import {
  Linking,
  MapView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class Location extends Component {
  render() {
    return (
      <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
        // TODO test android
        // TODO implement google map url
        const url = `http://maps.apple.com/?ll=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`;
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            return Linking.openURL(url);
          }
        }).catch(err => {
          console.error('An error occurred', err);
        });
      }}>
        <MapView
          style={[styles.mapView, this.props.mapViewStyle]}
          region={{
            latitude: this.props.currentMessage.location.latitude,
            longitude: this.props.currentMessage.location.longitude,
          }}
          annotations={[{
            latitude: this.props.currentMessage.location.latitude,
            longitude: this.props.currentMessage.location.longitude,
          }]}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});

Location.defaultProps = {
  containerStyle: {},
  mapViewStyle: {},
  currentMessage: {
    location: {
      latitude: 0,
      longitude: 0,
    },
  }
};
