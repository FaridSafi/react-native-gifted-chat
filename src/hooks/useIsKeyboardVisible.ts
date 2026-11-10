import { useEffect, useState } from 'react'
import { KeyboardController, KeyboardEvents } from 'react-native-keyboard-controller'

/**
 * Whether the software keyboard is currently on screen.
 *
 * Tracks `keyboardWillShow` / `keyboardWillHide` rather than the `Did` events so layout
 * reacts *with* the keyboard animation instead of a beat after it.
 *
 * `isEnabled` exists because this re-renders its consumer on every keyboard transition:
 * pass `false` and no listener is registered at all, so features that don't need the
 * keyboard state pay nothing for it.
 */
export function useIsKeyboardVisible (isEnabled: boolean = true): boolean {
  const [isVisible, setIsVisible] = useState(
    () => isEnabled && (KeyboardController.isVisible?.() ?? false)
  )

  useEffect(() => {
    if (!isEnabled) {
      setIsVisible(false)
      return
    }

    // The keyboard may already be up when this turns on (e.g. the prop flipped while the
    // composer was focused), and it can also change between render and subscribing.
    setIsVisible(KeyboardController.isVisible?.() ?? false)

    const subscriptions = [
      KeyboardEvents.addListener('keyboardWillShow', () => setIsVisible(true)),
      KeyboardEvents.addListener('keyboardWillHide', () => setIsVisible(false)),
    ]

    return () => subscriptions.forEach(subscription => subscription.remove())
  }, [isEnabled])

  return isVisible
}
