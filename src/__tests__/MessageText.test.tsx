import React from 'react'
import { render } from '@testing-library/react-native'

import { MessageText } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

it('should render <MessageText /> and compare with snapshot', async () => {
  const { toJSON } = await render(
    <MessageText
      currentMessage={DEFAULT_TEST_MESSAGE}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
