import React from 'react'
import { render } from '@testing-library/react-native'

import { LoadEarlier } from '../GiftedChat'

it('should render <LoadEarlier /> and compare with snapshot', () => {
  const { toJSON } = render(<LoadEarlier />)

  expect(toJSON()).toMatchSnapshot()
})
