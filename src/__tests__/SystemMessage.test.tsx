import React from 'react'
import { render } from '@testing-library/react-native'

import { SystemMessage } from '../GiftedChat'
import { DEFAULT_TEST_MESSAGE } from './data'

describe('SystemMessage', () => {
  it('should not render <SystemMessage /> and compare with snapshot', () => {
    const { toJSON } = render(<SystemMessage />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render <SystemMessage /> and compare with snapshot', () => {
    const { toJSON } = render(
      <SystemMessage
        currentMessage={{
          ...DEFAULT_TEST_MESSAGE,
          system: true,
        }}
      />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
