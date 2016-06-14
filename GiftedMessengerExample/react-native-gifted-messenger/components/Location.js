import React, { Component } from 'react';
import {
  MapView,
  TouchableOpacity,
  Linking,
} from 'react-native';

class Location extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => {
        // TODO test android
        // TODO implement google map url
        const url = `http://maps.apple.com/?ll=${this.props.location.latitude},${this.props.location.longitude}`;
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
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
          }}
          annotations={[{
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
          }]}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      </TouchableOpacity>
    );
  }
}

Location.defaultProps = {
  'customStyles': {},
  'location': {
    latitude: 0,
    longitude: 0,
  },
};

export default Location;
