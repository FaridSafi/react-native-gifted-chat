import React from 'react'
import { render } from '@testing-library/react-native'

import { Day } from '../GiftedChat'
import { DEFAULT_TEST_MESSAGE } from './data'

describe('Day', () => {
  it('should not render <Day /> and compare with snapshot', () => {
    const { toJSON } = render(<Day />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render <Day /> and compare with snapshot', () => {
    const { toJSON } = render(
      <Day currentMessage={DEFAULT_TEST_MESSAGE} />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
