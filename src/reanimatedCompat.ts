/**
 * Compatibility layer for react-native-reanimated v3 and v4
 *
 * In v3, types are exported from 'react-native-reanimated/lib/typescript/hook/commonTypes'
 * In v4, the type structure changed - we define a compatible type that works with both
 */

import type { NativeScrollEvent } from 'react-native'

/**
 * Compatible type for scroll events from useAnimatedScrollHandler
 * Works with both react-native-reanimated v3 and v4
 */
export type ReanimatedScrollEvent = Readonly<{
  contentOffset: {
    x: number
    y: number
  }
  contentSize: {
    height: number
    width: number
  }
  layoutMeasurement: {
    height: number
    width: number
  }
}> & Readonly<NativeScrollEvent>
