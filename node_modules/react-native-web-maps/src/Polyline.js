import React, { Component } from 'react';
import { Polyline } from 'react-google-maps';

class MapViewPolyline extends Component {
  render() {
    return <Polyline {...this.props} />;
  }
}

export default MapViewPolyline;
