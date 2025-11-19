import React from 'react'
import { render } from '@testing-library/react-native'

import { GiftedAvatar } from '..'

it('should render <GiftedAvatar /> and compare with snapshot', () => {
  const { toJSON } = render(<GiftedAvatar />)

  expect(toJSON()).toMatchSnapshot()
})
