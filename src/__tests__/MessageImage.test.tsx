import React from 'react'
import { render } from '@testing-library/react-native'

import { MessageImage } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

describe('MessageImage', () => {
  it('should not render <MessageImage /> and compare with snapshot', () => {
    const { toJSON } = render(<MessageImage currentMessage={null} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should  render <MessageImage /> and compare with snapshot', () => {
    const { toJSON } = render(
      <MessageImage
        currentMessage={{
          ...DEFAULT_TEST_MESSAGE,
          image: 'url://to/image.png',
        }}
      />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
