import 'react-native'
import React from 'react'
import createComponentWithContext from './context'

import { Message } from '../GiftedChat'

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
