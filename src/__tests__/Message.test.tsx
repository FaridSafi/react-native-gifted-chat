import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { Message } from '../GiftedChat'

it('should render <Message /> and compare with snapshot', () => {
  const tree = renderer
    .create(
      <Message
        key='123'
        user={{ _id: 1 }}
        currentMessage={{
          _id: 1,
          text: 'test',
          createdAt: new Date(),
          user: { _id: 1 },
        }}
      />,
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
