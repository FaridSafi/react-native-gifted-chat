import React from 'react'
import { render } from '@testing-library/react-native'

import { MessageText } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

it('should render <MessageText /> and compare with snapshot', () => {
  const { toJSON } = render(
    <MessageText
      currentMessage={DEFAULT_TEST_MESSAGE}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
