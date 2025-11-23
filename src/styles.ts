import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  fill: {
    flex: 1,
  },
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export function getColorSchemeStyle<T>(styles: T, baseName: string, colorScheme: string | null | undefined) {
  const key = `${baseName}_${colorScheme}` as keyof T
  return [styles[baseName as keyof T], styles[key]]
}
