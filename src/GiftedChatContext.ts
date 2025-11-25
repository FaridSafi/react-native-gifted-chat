import { createContext, useContext } from 'react'
import {
  ActionSheetOptions,
} from '@expo/react-native-action-sheet'

export interface IGiftedChatContext {
  actionSheet(): {
    showActionSheetWithOptions: (
      options: ActionSheetOptions,
      callback: (buttonIndex?: number) => void | Promise<void>
    ) => void
  }
  getLocale(): string
  getColorScheme(): 'light' | 'dark' | null | undefined
}

export const GiftedChatContext = createContext<IGiftedChatContext>({
  getLocale: () => 'en',
  actionSheet: () => ({
    showActionSheetWithOptions: () => {},
  }),
  getColorScheme: () => undefined,
})

export const useChatContext = () => useContext(GiftedChatContext)
