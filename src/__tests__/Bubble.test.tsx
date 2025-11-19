import React from 'react'
import { render } from '@testing-library/react-native'

import { Bubble } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

it('should render <Bubble /> and compare with snapshot', () => {
  const { toJSON } = render(
    <Bubble
      user={{ _id: 1 }}
      currentMessage={DEFAULT_TEST_MESSAGE}
      position='left'
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
