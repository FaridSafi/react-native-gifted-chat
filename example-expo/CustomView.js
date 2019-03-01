/* eslint-disable */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapView } from 'expo';

const styles = StyleSheet.create({
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});

export default function CustomView(props) {
  if (props.currentMessage.location) {
    return (
      <View style={props.containerStyle}>
        <MapView
          style={[styles.mapView]}
          region={{
            latitude: props.currentMessage.location.latitude,
            longitude: props.currentMessage.location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <MapView.Marker
            coordinate={{
              latitude: props.currentMessage.location.latitude,
              longitude: props.currentMessage.location.longitude,
            }}
          />
        </MapView>
      </View>
    );
  }
  return null;
}
