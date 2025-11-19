import React from 'react'
import { render } from '@testing-library/react-native'

import { Day } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'

describe('Day', () => {
  it('should not render <Day /> and compare with snapshot', () => {
    const { toJSON } = render(<Day createdAt={DEFAULT_TEST_MESSAGE.createdAt} />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render <Day /> and compare with snapshot', () => {
    const { toJSON } = render(
      <Day createdAt={DEFAULT_TEST_MESSAGE.createdAt} />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
