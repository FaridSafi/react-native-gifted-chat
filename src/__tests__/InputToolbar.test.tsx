import React from 'react'
import { render } from '@testing-library/react-native'

import { InputToolbar } from '../GiftedChat'

it('should render <InputToolbar /> and compare with snapshot', () => {
  const { toJSON } = render(<InputToolbar />)

  expect(toJSON()).toMatchSnapshot()
})
