import React from 'react'
import { render } from '@testing-library/react-native'

import { ReplyPreview } from '../components/ReplyPreview'
import { ReplyMessage } from '../Models'

const replyMessage: ReplyMessage = {
  _id: 'reply-1',
  text: 'Original message to reply to',
  user: {
    _id: 2,
    name: 'John Doe',
  },
}

it('should render <ReplyPreview /> and compare with snapshot', () => {
  const { toJSON } = render(
    <ReplyPreview
      replyMessage={replyMessage}
      onClearReply={() => {}}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})

it('should render <ReplyPreview /> with image and compare with snapshot', () => {
  const replyWithImage: ReplyMessage = {
    ...replyMessage,
    image: 'https://example.com/image.jpg',
  }

  const { toJSON } = render(
    <ReplyPreview
      replyMessage={replyWithImage}
      onClearReply={() => {}}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
