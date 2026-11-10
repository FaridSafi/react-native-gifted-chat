import React from 'react'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'

import { Avatar } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

it('should render <Avatar /> and compare with snapshot', async () => {
  const { toJSON } = await render(
    <Avatar
      renderAvatar={() => <Text>{'renderAvatar'}</Text>}
      position='left'
      currentMessage={DEFAULT_TEST_MESSAGE}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
