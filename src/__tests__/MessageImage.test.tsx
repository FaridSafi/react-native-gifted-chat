import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { MessageImage } from '../GiftedChat'
import { DEFAULT_TEST_MESSAGE } from './data'

describe('MessageImage', () => {
  it('should not render <MessageImage /> and compare with snapshot', () => {
    const tree = renderer.create(<MessageImage />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should  render <MessageImage /> and compare with snapshot', () => {
    const tree = renderer
      .create(
        <MessageImage
          currentMessage={{
            ...DEFAULT_TEST_MESSAGE,
            image: 'url://to/image.png',
          }}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
