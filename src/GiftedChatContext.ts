import * as React from 'react'

export interface IGiftedChatContext {
  actionSheet(): {
    showActionSheetWithOptions: (option?: any, cb?: any) => any,
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
