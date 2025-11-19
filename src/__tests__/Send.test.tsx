import React from 'react'
import { render } from '@testing-library/react-native'

import { Send } from '..'

describe('Send', () => {
  it('should not render <Send /> and compare with snapshot', () => {
    const { toJSON } = render(<Send />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should always render <Send /> and compare with snapshot', () => {
    const { toJSON } = render(<Send alwaysShowSend />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render <Send /> where there is input and compare with snapshot', () => {
    const { toJSON } = render(<Send text='test input' />)
    expect(toJSON()).toMatchSnapshot()
  })
})
