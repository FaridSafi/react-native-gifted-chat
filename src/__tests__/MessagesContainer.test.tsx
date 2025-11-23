import React from 'react'
import { render } from '@testing-library/react-native'

import { MessagesContainer } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

it('should render <MessagesContainer /> without crashing', () => {
  // Just verify it renders without throwing
  expect(() => render(
    <MessagesContainer
      messages={[DEFAULT_TEST_MESSAGE]}
      user={{ _id: 1 }}
    />
  )).not.toThrow()
})

it('should render <MessagesContainer /> with multiple messages', () => {
  const messages = [
    { ...DEFAULT_TEST_MESSAGE, _id: 'test1' },
    { ...DEFAULT_TEST_MESSAGE, _id: 'test2' },
  ]

  expect(() => render(
    <MessagesContainer
      messages={messages}
      user={{ _id: 1 }}
    />
  )).not.toThrow()
})

it('should render <MessagesContainer /> with empty messages', () => {
  expect(() => render(
    <MessagesContainer
      messages={[]}
      user={{ _id: 1 }}
    />
  )).not.toThrow()
})
