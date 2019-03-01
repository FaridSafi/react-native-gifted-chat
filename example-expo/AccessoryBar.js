import { MaterialIcons } from '@expo/vector-icons';
import { ImagePicker, Location, Permissions } from 'expo';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default class AccessoryBar extends React.Component {

  _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location;
  };

  _pickImageAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      // Upload image (result.uri)
      const storageUrl = result.uri;
      return storageUrl;
    }

    return null;
  };

  _takePictureAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      // Upload image (result.uri)
      const storageUrl = result.uri;
      return storageUrl;
    }

    return null;
  };

  onGalleryPressedAsync = async () => {
    const image = await this._pickImageAsync();
    if (image) {
      this.props.onSend([{ image }]);
    }
  };

  onCameraPressedAsync = async () => {
    const image = await this._takePictureAsync();
    if (image) {
      this.props.onSend([{ image }]);
    }
  };

  onLocationPressedAsync = async () => {
    const location = await this._getLocationAsync();
    if (location) {
      this.props.onSend([
        {
          location: location.coords,
        },
      ]);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.onGalleryPressedAsync} name="photo" />
        <Button onPress={this.onCameraPressedAsync} name="camera" />
        <Button onPress={this.onLocationPressedAsync} name="my-location" />
      </View>
    );
  }

}

const Button = ({ onPress, size = 30, color = 'rgba(0,0,0,0.5)', ...props }) => (
  <TouchableOpacity onPress={onPress}>
    <MaterialIcons size={size} color={color} {...props} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
});
