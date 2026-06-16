import { createContext, useContext } from 'react'
import { ColorSchemeName } from 'react-native'
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
  getColorScheme(): ColorSchemeName | null | undefined
}

export const GiftedChatContext = createContext<IGiftedChatContext>({
  getLocale: () => 'en',
  actionSheet: () => ({
    showActionSheetWithOptions: () => {},
  }),
  getColorScheme: () => null,
})

export const useChatContext = () => useContext(GiftedChatContext)
