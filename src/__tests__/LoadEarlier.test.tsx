import React from 'react'
import { render } from '@testing-library/react-native'

import { LoadEarlierMessages } from '..'

it('should render <LoadEarlierMessages /> and compare with snapshot', async () => {
  const { toJSON } = await render(<LoadEarlierMessages isAvailable isLoading={false} onPress={() => {}} />)

  expect(toJSON()).toMatchSnapshot()
})
