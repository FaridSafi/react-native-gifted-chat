import * as React from 'react'
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
}

export const GiftedChatContext = React.createContext<IGiftedChatContext>({
  getLocale: () => 'en',
  actionSheet: () => ({
    showActionSheetWithOptions: () => {},
  }),
})

export const useChatContext = () => React.useContext(GiftedChatContext)
