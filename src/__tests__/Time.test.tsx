import React from 'react'
import { render } from '@testing-library/react-native'

import { Time } from '../GiftedChat'
import { DEFAULT_TEST_MESSAGE } from './data'

describe('Time', () => {
  it('should not render <Time /> and compare with snapshot', () => {
    const { toJSON } = render(<Time />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render <Time /> and compare with snapshot', () => {
    const { toJSON } = render(
      <Time
        currentMessage={{
          ...DEFAULT_TEST_MESSAGE,
          createdAt: new Date(2022, 3, 17, 10, 5, 2),
        }}
      />
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
