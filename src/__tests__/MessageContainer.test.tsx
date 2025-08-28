import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { MessageContainer } from '../GiftedChat'

const messages = [
  {
    _id: 1,
    text: 'Hello developer',
    createdAt: new Date('2023-01-01T12:00:00.000Z'),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
]

it('should render <MessageContainer /> and compare with snapshot', () => {
  const tree = renderer.create(<MessageContainer />).toJSON()

  expect(tree).toMatchSnapshot()
})

it('should render <MessageContainer /> with showStickyDate=true (default)', () => {
  const tree = renderer.create(<MessageContainer messages={messages} />).toJSON()

  expect(tree).toMatchSnapshot()
})

it('should render <MessageContainer /> with showStickyDate=false', () => {
  const tree = renderer.create(<MessageContainer messages={messages} showStickyDate={false} />).toJSON()

  expect(tree).toMatchSnapshot()
})
