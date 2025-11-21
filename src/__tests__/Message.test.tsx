import React from 'react'
import { render } from '@testing-library/react-native'

import { Message } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

describe('Message component', () => {
  it('should render <Message /> and compare with snapshot', () => {
    const { toJSON } = render(
      <Message
        key='123'
        user={{ _id: 1 }}
        currentMessage={{
          _id: 1,
          text: 'test',
          createdAt: 1554744013721,
          user: { _id: 1 },
        }}
        position='left'
      />
    )

    expect(toJSON()).toMatchSnapshot()
  })

  it('should NOT render <Message />', () => {
    const { toJSON } = render(
      <Message key='123' user={{ _id: 1 }} currentMessage={null} position='left' />
    )

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render <Message /> with Avatar', () => {
    const { toJSON } = render(
      <Message
        key='123'
        user={{ _id: 1 }}
        currentMessage={DEFAULT_TEST_MESSAGE}
        position='left'
        isUserAvatarVisible
      />
    )

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render null if user has no Avatar', () => {
    const { toJSON } = render(
      <Message
        key='123'
        user={{ _id: 1 }}
        currentMessage={{
          ...DEFAULT_TEST_MESSAGE,
          user: {
            _id: 1,
            avatar: undefined,
          },
        }}
        position='left'
        isUserAvatarVisible
      />
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
