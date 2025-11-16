import React from 'react'
import { render } from '@testing-library/react-native'

import { Bubble } from '../GiftedChat'

it('should render <Bubble /> and compare with snapshot', () => {
  const { toJSON } = render(
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

  expect(toJSON()).toMatchSnapshot()
})
