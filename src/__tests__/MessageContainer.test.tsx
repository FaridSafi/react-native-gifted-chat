import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { MessageContainer } from '../GiftedChat'

jest.mock('react-native-keyboard-controller', () => ({
  useReanimatedKeyboardAnimation: () => ({
    height: { value: 0 },
  }),
  KeyboardProvider: ({ children }: { children: React.ReactNode }) => children,
}))

it('should render <MessageContainer /> and compare with snapshot', () => {
  const tree = renderer.create(<MessageContainer />).toJSON()

  expect(tree).toMatchSnapshot()
})
