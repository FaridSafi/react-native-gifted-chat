import React from 'react'
import { render } from '@testing-library/react-native'

import { Avatar } from '../GiftedChat'

it('should render <Avatar /> and compare with snapshot', () => {
  const { toJSON } = render(
    <Avatar renderAvatar={() => 'renderAvatar'} position='left' />
  )

  expect(toJSON()).toMatchSnapshot()
})
