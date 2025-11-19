import React from 'react'
import { render } from '@testing-library/react-native'

import { Avatar } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

it('should render <Avatar /> and compare with snapshot', () => {
  const { toJSON } = render(
    <Avatar
      renderAvatar={() => 'renderAvatar'}
      position='left'
      currentMessage={DEFAULT_TEST_MESSAGE}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
