import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { Avatar } from '../GiftedChat'

it('should render <Avatar /> and compare with snapshot', () => {
  const tree = renderer
    .create(<Avatar renderAvatar={() => 'renderAvatar'} position='left' />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})
