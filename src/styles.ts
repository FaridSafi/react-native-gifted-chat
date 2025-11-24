import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native'

export default StyleSheet.create({
  fill: {
    flex: 1,
  },
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export function getColorSchemeStyle<T>(styles: T, baseName: string, colorScheme?: string | null) {
  const key = `${baseName}_${colorScheme}` as keyof T
  return [styles[baseName as keyof T], styles[key]]
}

export function getStyleWithPosition<T>(styles: T, baseName: string, position?: 'left' | 'right' | null) {
  const stylesArray = [styles[baseName as keyof T]]
  if (position) {
    const key = `${baseName}_${position}` as keyof T
    stylesArray.push(styles[key])
  }
  return StyleSheet.flatten(stylesArray) as StyleProp<ViewStyle> | StyleProp<TextStyle>
}
