import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { Bubble } from '../GiftedChat'

it('should render <Bubble /> and compare with snapshot', () => {
  const tree = renderer
    .create(
      <Bubble<any>
        user={{ _id: 1 }}
        currentMessage={{
          _id: 1,
          text: 'test',
          createdAt: 1554744013721,
          user: { _id: 1 },
        }}
      />,
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
