import React from 'react'
import { render } from '@testing-library/react-native'

import { InputToolbar } from '..'

it('should render <InputToolbar /> and compare with snapshot', async () => {
  const { toJSON } = await render(<InputToolbar />)

  expect(toJSON()).toMatchSnapshot()
})
