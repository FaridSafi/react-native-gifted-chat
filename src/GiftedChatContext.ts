import * as React from 'react'
import { MIN_COMPOSER_HEIGHT } from './Constant'

export interface IGiftedChatContext {
  actionSheet(): { showActionSheetWithOptions: (option?: any, cb?: any) => any }
  getLocale(): string
  minComposerHeight: number
}

export const GiftedChatContext = React.createContext<IGiftedChatContext>({
  getLocale: () => 'en',
  actionSheet: () => ({
    showActionSheetWithOptions: () => {},
  }),
  minComposerHeight: MIN_COMPOSER_HEIGHT || 0
})

export const useChatContext = () => React.useContext(GiftedChatContext)
