import React from 'react'
import { render } from '@testing-library/react-native'

import { LoadEarlierMessages } from '../GiftedChat'

it('should render <LoadEarlierMessages /> and compare with snapshot', () => {
  const { toJSON } = render(<LoadEarlierMessages />)

  expect(toJSON()).toMatchSnapshot()
})
