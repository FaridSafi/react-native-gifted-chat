import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { Bubble } from '../GiftedChat'

it('should render <Bubble /> and compare with snapshot', () => {
  let tree

  renderer.act(() => {
    tree = renderer.create(
      <Bubble
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
  })

  expect(tree.toJSON()).toMatchSnapshot()
})
