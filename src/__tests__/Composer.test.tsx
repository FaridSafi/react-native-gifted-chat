import React from 'react'
import { render } from '@testing-library/react-native'

import { Composer } from '..'

it('should render <Composer /> and compare with snapshot', () => {
  const { toJSON } = render(<Composer />)

  expect(toJSON()).toMatchSnapshot()
})
