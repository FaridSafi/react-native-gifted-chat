import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { GiftedChat } from '../GiftedChat'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'

const messages = [
  {
    _id: 1,
    text: 'Hello developer',
    createdAt: new Date('2023-01-01T12:00:00.000Z'),
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

it('should render <GiftedChat/> with showStickyDate=false and compare with snapshot', () => {
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
        showStickyDate={false}
      />
    )
  })

  expect(tree.toJSON()).toMatchSnapshot()
})
