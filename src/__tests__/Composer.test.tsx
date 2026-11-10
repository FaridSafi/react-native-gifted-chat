import React from 'react'
import { render } from '@testing-library/react-native'

import { Composer } from '..'

it('should render <Composer /> and compare with snapshot', async () => {
  const { toJSON } = await render(<Composer />)

  expect(toJSON()).toMatchSnapshot()
})
