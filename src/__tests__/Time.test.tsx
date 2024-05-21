import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { Time } from '../GiftedChat'
import { DEFAULT_TEST_MESSAGE } from './data'

describe('Time', () => {
  it('should not render <Time /> and compare with snapshot', () => {
    const component = renderer.create(<Time />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render <Time /> and compare with snapshot', () => {
    const component = renderer.create(
      <Time
        currentMessage={{
          ...DEFAULT_TEST_MESSAGE,
          createdAt: new Date(2022, 3, 17, 10, 5, 2),
        }}
      />
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
