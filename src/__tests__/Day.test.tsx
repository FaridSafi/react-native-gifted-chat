import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { Day } from '../GiftedChat'

it('should render <Day /> and compare with snapshot', () => {
  const component = renderer.create(<Day />)
  const tree = component.toJSON()

  expect(tree).toMatchSnapshot()
})
