import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { GiftedChat } from '../GiftedChat'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'

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
  let tree

  renderer.act(() => {
    (useReanimatedKeyboardAnimation as jest.Mock).mockReturnValue({
      height: {
        value: 0,
      },
    })

    tree = renderer.create(
      <GiftedChat
        messages={messages}
        onSend={() => {}}
        user={{
          _id: 1,
        }}
      />
    )
  })

  expect(tree.toJSON()).toMatchSnapshot()
})
