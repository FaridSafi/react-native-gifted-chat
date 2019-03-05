import { Permissions, Location, ImagePicker, Linking } from 'expo';

import { Alert } from 'react-native';

export default async function getPermissionAsync(permission) {
  const { status } = await Permissions.askAsync(permission);
  if (status !== 'granted') {
    const { name } = Constants.manifest;
    const permissionName = permission.toLowerCase().replace('_', ' ');
    Alert.alert(
      'Cannot be done 😞',
      `If you would like to use this feature, you'll need to enable the ${permissionName} permission in your phone settings.`,
      [
        {
          text: "Let's go!",
          onPress: () => Linking.openURL('app-settings:'),
        },
        { text: 'Nevermind', onPress: () => {}, style: 'cancel' },
      ],
      { cancelable: true },
    );

    return false;
  }
  return true;
}

export async function getLocationAsync(onSend) {
  if (await getPermissionAsync(Permissions.LOCATION)) {
    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      onSend([{ location: location.coords }]);
    }
  }
}

export async function pickImageAsync(onSend) {
  if (await getPermissionAsync(Permissions.CAMERA_ROLL)) {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      onSend([{ image: result.uri }]);
      return result.uri;
    }
  }
}

export async function takePictureAsync(onSend) {
  if (await getPermissionAsync(Permissions.CAMERA)) {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      onSend([{ image: result.uri }]);
      return result.uri;
    }
  }
}
