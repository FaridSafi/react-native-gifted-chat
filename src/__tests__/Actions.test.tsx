import React from 'react'
import { render } from '@testing-library/react-native'

import { Actions } from '../GiftedChat'

it('should render <Actions /> and compare with snapshot', () => {
  const { toJSON } = render(<Actions />)
  expect(toJSON()).toMatchSnapshot()
})
