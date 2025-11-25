import React from 'react'
import { render } from '@testing-library/react-native'

import { GiftedChat } from '..'

const messages = [
  {
    _id: 1,
    text: 'Hello developer',
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'John Doe',
    },
  },
]

it('should render <GiftedChat/> and compare with snapshot', () => {
  const { toJSON } = render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})

it('should render <GiftedChat/> with light colorScheme and compare with snapshot', () => {
  const { toJSON } = render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
      colorScheme='light'
    />
  )

  expect(toJSON()).toMatchSnapshot()
})

it('should render <GiftedChat/> with dark colorScheme and compare with snapshot', () => {
  const { toJSON } = render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
      colorScheme='dark'
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
