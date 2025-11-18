import * as ImagePicker from 'expo-image-picker'

import { getCurrentPositionAsync, LocationObjectCoords, requestForegroundPermissionsAsync } from 'expo-location'

export async function getLocationAsync (): Promise<LocationObjectCoords | undefined> {
  const response = await requestForegroundPermissionsAsync()
  if (!response.granted)
    return

  const location = await getCurrentPositionAsync()
  if (!location)
    return

  return location.coords
}

export async function pickImageAsync (): Promise<string[] | undefined> {
  const response = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!response.granted)
    return

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  })

  if (result.canceled)
    return

  return result.assets.map(({ uri }) => uri)
}

export async function takePictureAsync (): Promise<string[] | undefined> {
  const response = await ImagePicker.requestCameraPermissionsAsync()
  if (!response.granted)
    return

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
  })

  if (result.canceled)
    return

  return result.assets.map(({ uri }) => uri)
}
