// Fallback for using MaterialIcons on Android and web.

import { ComponentProps } from 'react'
import { type ColorValue, type StyleProp, type TextStyle } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight, SymbolViewProps } from 'expo-symbols'

type IconMapping = Record<Extract<SymbolViewProps['name'], string>, ComponentProps<typeof MaterialIcons>['name']>
type IconSymbolName = keyof typeof MAPPING

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol ({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName
  size?: number
  color: ColorValue
  style?: StyleProp<TextStyle>
  weight?: SymbolWeight
}) {
  // @expo/vector-icons still types `color` without React Native 0.88's internal ColorValue
  // member, which is what a tab bar hands its icons.
  const iconColor = color as ComponentProps<typeof MaterialIcons>['color']

  return <MaterialIcons color={iconColor} size={size} name={MAPPING[name]} style={style} />
}
