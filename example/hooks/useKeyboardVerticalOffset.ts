import { useHeaderHeight } from '@react-navigation/elements'

/**
 * Hook to get the correct keyboardVerticalOffset for GiftedChat.
 *
 * The offset equals the distance from the screen top to the GiftedChat container top.
 * Uses useHeaderHeight() which includes status bar + navigation header height on iOS.
 *
 * Note: This hook requires the component to be rendered inside a proper navigation screen
 * (not conditional rendering). If useHeaderHeight returns 0, ensure your chat screen
 * is a real navigation screen with a visible header.
 *
 * @returns {number} keyboardVerticalOffset to pass to keyboardAvoidingViewProps
 */
export function useKeyboardVerticalOffset () {
  // useHeaderHeight() returns status bar + navigation header height on iOS
  return useHeaderHeight()
}
