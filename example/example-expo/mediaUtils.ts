import * as Linking from 'expo-linking'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

import { Alert } from 'react-native'

export default async function getPermissionAsync (
  permission: Permissions.PermissionType
) {
  const { status } = await Permissions.askAsync(permission)
  if (status !== 'granted') {
    const permissionName = permission.toLowerCase().replace('_', ' ')
    Alert.alert(
      'Cannot be done 😞',
      `If you would like to use this feature, you'll need to enable the ${permissionName} permission in your phone settings.`,
      [
        {
          text: 'Let\'s go!',
          onPress: () => Linking.openURL('app-settings:'),
        },
        { text: 'Nevermind', onPress: () => {}, style: 'cancel' },
      ],
      { cancelable: true }
    )

    return false
  }
  return true
}

export async function getLocationAsync (
  onSend: (locations: { location: Location.LocationObjectCoords }[]) => void
) {
  const response = await Location.requestForegroundPermissionsAsync()
  if (!response.granted)
    return

  const location = await Location.getCurrentPositionAsync()
  if (!location)
    return

  onSend([{ location: location.coords }])
}

export async function pickImageAsync (
  onSend: (images: { image: string }[]) => void
) {
  const response = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!response.granted)
    return

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  })

  if (result.canceled)
    return

  const images = result.assets.map(({ uri: image }) => ({ image }))
  onSend(images)
}

export async function takePictureAsync (
  onSend: (images: { image: string }[]) => void
) {
  const response = await ImagePicker.requestCameraPermissionsAsync()
  if (!response.granted)
    return

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
  })

  if (result.canceled)
    return

  const images = result.assets.map(({ uri: image }) => ({ image }))
  onSend(images)
}
