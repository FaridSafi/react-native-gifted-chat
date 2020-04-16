import 'react-native'
import React from 'react'
import createComponentWithContext from './context'

import { Message } from '../GiftedChat'

describe('Message component', () => {
  it('should render <Message /> and compare with snapshot', () => {
    const tree = createComponentWithContext(
      <Message
        key='123'
        user={{ _id: 1 }}
        currentMessage={{
          _id: 1,
          text: 'test',
          createdAt: 1554744013721,
          user: { _id: 1 },
        }}
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should NOT render <Message />', () => {
    const tree = createComponentWithContext(
      <Message key='123' user={{ _id: 1 }} currentMessage={null} />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render <Message /> with Avatar', () => {
    const tree = createComponentWithContext(
      <Message
        key='123'
        user={{ _id: 1 }}
        currentMessage={{
          _id: 1,
          text: 'test',
          createdAt: 1554744013721,
          user: { _id: 1 },
        }}
        showUserAvatar
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render null if user has no Avatar', () => {
    const tree = createComponentWithContext(
      <Message
        key='123'
        user={{ _id: 1 }}
        currentMessage={{
          _id: 1,
          text: 'test',
          createdAt: 1554744013721,
          user: {
            _id: 1,
            avatar: null,
          },
        }}
        showUserAvatar
      />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
