import React from 'react'
import { render } from '@testing-library/react-native'

import { MessageText } from '../GiftedChat'

it('should render <MessageText /> and compare with snapshot', () => {
  const { toJSON } = render(
    <MessageText
      currentMessage={{ _id: 1, createdAt: new Date(), text: 'test message' }}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
