import React from 'react'
import { render } from '@testing-library/react-native'

import { MessageReply } from '../components/MessageReply'
import { IMessage, ReplyMessage } from '../Models'

const replyMessage: ReplyMessage = {
  _id: 'reply-1',
  text: 'Original message text',
  user: {
    _id: 2,
    name: 'John Doe',
  },
}

const currentMessage: IMessage = {
  _id: 'msg-1',
  text: 'Reply text',
  createdAt: new Date(),
  user: {
    _id: 1,
    name: 'Jane Doe',
  },
  replyMessage,
}

it('should render <MessageReply /> and compare with snapshot', () => {
  const { toJSON } = render(
    <MessageReply
      replyMessage={replyMessage}
      currentMessage={currentMessage}
      position='left'
    />
  )

  expect(toJSON()).toMatchSnapshot()
})

it('should render <MessageReply /> on right position and compare with snapshot', () => {
  const currentMessageFromCurrentUser: IMessage = {
    ...currentMessage,
    user: replyMessage.user,
  }

  const { toJSON } = render(
    <MessageReply
      replyMessage={replyMessage}
      currentMessage={currentMessageFromCurrentUser}
      position='right'
    />
  )

  expect(toJSON()).toMatchSnapshot()
})
