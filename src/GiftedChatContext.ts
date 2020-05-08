import * as React from 'react'

export interface IGiftedChatContext {
  actionSheet?(): void
  getLocale(): string
}

export const GiftedChatContext = React.createContext<IGiftedChatContext>({
  getLocale: () => 'en',
})

export const useChatContext = () => React.useContext(GiftedChatContext)
