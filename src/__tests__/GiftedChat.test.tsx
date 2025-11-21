import React from 'react'
import { render } from '@testing-library/react-native'

import { useAnimatedKeyboard } from 'react-native-reanimated'
import { GiftedChat } from '..'

const messages = [
  {
    _id: 1,
    text: 'Hello developer',
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
]

it('should render <GiftedChat/> and compare with snapshot', () => {
  (useAnimatedKeyboard as jest.Mock).mockReturnValue({
    height: {
      value: 0,
    },
  })

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

it('should render <GiftedChat/> with isKeyboardInternallyHandled=false', () => {
  (useAnimatedKeyboard as jest.Mock).mockReturnValue({
    height: {
      value: 0,
    },
  })

  const { toJSON } = render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
      isKeyboardInternallyHandled={false}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
