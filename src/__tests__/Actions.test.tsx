import React from 'react'
import { render } from '@testing-library/react-native'

import { Actions } from '..'

it('should render <Actions /> and compare with snapshot', async () => {
  const { toJSON } = await render(<Actions />)
  expect(toJSON()).toMatchSnapshot()
})
