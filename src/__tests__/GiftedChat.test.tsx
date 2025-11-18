import React from 'react'
import { render } from '@testing-library/react-native'

import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import { GiftedChat } from '../GiftedChat'

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
  (useReanimatedKeyboardAnimation as jest.Mock).mockReturnValue({
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

it('should render <GiftedChat/> with disableKeyboardController=true', () => {
  (useReanimatedKeyboardAnimation as jest.Mock).mockReturnValue({
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
      disableKeyboardController={true}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
