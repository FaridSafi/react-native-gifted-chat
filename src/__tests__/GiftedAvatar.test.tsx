import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { GiftedAvatar } from '../GiftedChat'

it('should render <GiftedAvatar /> and compare with snapshot', () => {
  let tree

  renderer.act(() => {
    tree = renderer.create(<GiftedAvatar />)
  })

  expect(tree.toJSON()).toMatchSnapshot()
})
