import React from 'react'
import { render } from '@testing-library/react-native'

import { Bubble } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

it('should render <Bubble /> and compare with snapshot', () => {
  const { toJSON } = render(
    <Bubble
      user={{ _id: 1 }}
      currentMessage={DEFAULT_TEST_MESSAGE}
      position='left'
    />
  )

  expect(toJSON()).toMatchSnapshot()
})

it('should render sent status for current user message', () => {
  const { getByText } = render(
    <Bubble
      user={{ _id: 'test' }}
      currentMessage={{
        ...DEFAULT_TEST_MESSAGE,
        sent: true,
      }}
      position='left'
    />
  )

  expect(getByText('✓')).toBeTruthy()
})

it('should render received status for current user message', () => {
  const { getByText } = render(
    <Bubble
      user={{ _id: 'test' }}
      currentMessage={{
        ...DEFAULT_TEST_MESSAGE,
        received: true,
      }}
      position='left'
    />
  )

  expect(getByText('✓')).toBeTruthy()
})

it('should render pending status for current user message', () => {
  const { getByText } = render(
    <Bubble
      user={{ _id: 'test' }}
      currentMessage={{
        ...DEFAULT_TEST_MESSAGE,
        pending: true,
      }}
      position='left'
    />
  )

  expect(getByText('🕓')).toBeTruthy()
})

it('should not render message status for another user', () => {
  const { queryByText } = render(
    <Bubble
      user={{ _id: 'current-user' }}
      currentMessage={{
        ...DEFAULT_TEST_MESSAGE,
        user: { _id: 'other-user' },
        sent: true,
      }}
      position='left'
    />
  )

  expect(queryByText('✓')).toBeNull()
})
