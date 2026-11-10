import { render as renderBase } from '@testing-library/react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

/**
 * gesture-handler 3's `GestureDetector` throws in development when there is no
 * `GestureHandlerRootView` above it. `GiftedChat` mounts one itself; tests that render
 * a lower-level component (a bubble, a player, the list) on its own mount it here,
 * the way an app does at its root.
 */
export const render: typeof renderBase = (ui, options) =>
  renderBase(ui, { wrapper: GestureHandlerRootView, ...options })
