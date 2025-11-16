import React from 'react'
import { render } from '@testing-library/react-native'

import { MessageContainer } from '../GiftedChat'
import { DEFAULT_TEST_MESSAGE } from './data'

it('should render <MessageContainer /> without crashing', () => {
  const { getByTestId } = render(
    <MessageContainer
      messages={[DEFAULT_TEST_MESSAGE]}
      user={{ _id: 'test' }}
    />
  )

  // Just verify it renders without throwing
  expect(() => render(
    <MessageContainer
      messages={[DEFAULT_TEST_MESSAGE]}
      user={{ _id: 'test' }}
    />
  )).not.toThrow()
})

it('should render <MessageContainer /> with multiple messages', () => {
  const messages = [
    { ...DEFAULT_TEST_MESSAGE, _id: 'test1' },
    { ...DEFAULT_TEST_MESSAGE, _id: 'test2' },
  ]

  expect(() => render(
    <MessageContainer
      messages={messages}
      user={{ _id: 'test' }}
    />
  )).not.toThrow()
})

it('should render <MessageContainer /> with empty messages', () => {
  expect(() => render(
    <MessageContainer
      messages={[]}
      user={{ _id: 'test' }}
    />
  )).not.toThrow()
})
