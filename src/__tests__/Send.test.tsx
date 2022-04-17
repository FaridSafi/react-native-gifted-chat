import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { Send } from '../GiftedChat'

describe('Send', () => {
  it('should not render <Send /> and compare with snapshot', () => {
    const tree = renderer.create(<Send />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should always render <Send /> and compare with snapshot', () => {
    const tree = renderer.create(<Send alwaysShowSend />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render <Send /> where there is input and compare with snapshot', () => {
    const tree = renderer.create(<Send text='test input' />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
