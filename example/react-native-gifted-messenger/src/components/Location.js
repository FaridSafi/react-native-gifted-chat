import React, { Component } from 'react';
import {
  MapView,
  TouchableOpacity,
  Linking,
} from 'react-native';

class Location extends Component {
  render() {
    return (
      <TouchableOpacity style={this.props.customStyles.Location.container} onPress={() => {
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
          style={this.props.customStyles.Location.mapView}
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

Location.defaultProps = {
  customStyles: {},
  currentMessage: {
    location: {
      latitude: 0,
      longitude: 0,
    },
  }
};

export default Location;
