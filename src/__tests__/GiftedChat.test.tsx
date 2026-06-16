import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

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

it('preserves the default `text` prop on initial render (#603)', () => {
  const { getByDisplayValue, getByTestId } = render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
      text='test'
    />
  )

  // Mount the input toolbar by simulating the initial layout pass (this is also
  // where the text-init/reset logic runs that #603 reported as clearing text).
  fireEvent(getByTestId('GC_WRAPPER'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 800 } },
  })

  // The composer must show the provided default text, not a cleared value.
  expect(getByDisplayValue('test')).toBeTruthy()
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
