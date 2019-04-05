import 'react-native'
import React from 'react'
import createComponentWithContext from './context'

import { Bubble } from '../GiftedChat'

it('should render <Bubble /> and compare with snapshot', () => {
  const tree = createComponentWithContext(
    <Bubble
      user={{ _id: 1 }}
      currentMessage={{
        _id: 1,
        text: 'test',
        createdAt: new Date(),
        user: { _id: 1 },
      }}
    />,
  ).toJSON()

  expect(tree).toMatchSnapshot()
})
