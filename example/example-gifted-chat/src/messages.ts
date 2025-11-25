import { IMessage } from 'react-native-gifted-chat'

const messages: IMessage[] = [
  {
    text: `Hello this is an example of the ParsedText, links like http://www.google.com or http://www.facebook.com are clickable and phone number 444-555-6666 can call too.
        But you can also do more with this package, for example Bob will change style and David too. foo@gmail.com
        And the magic number is 42!
        #react #react-native`,
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'John Doe',
      avatar: 'https://placeimg.com/140/140/any',
    },
  },
  {
    text: 'Come on!',
    createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
    user: {
      _id: 2,
      name: 'John Doe',
      avatar: 'https://placeimg.com/140/140/any',
    },
  },
  {
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: new Date(Date.UTC(2016, 5, 15, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'John Doe',
      avatar: 'https://placeimg.com/140/140/any',
    },
    quickReplies: {
      type: 'checkbox', // or 'radio',
      values: [
        {
          title: 'Yes',
          value: 'yes',
        },
        {
          title: 'Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: 'Nope. What?',
          value: 'no',
        },
      ],
    },
  },
  {
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: new Date(Date.UTC(2016, 5, 14, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'John Doe',
      avatar: 'https://placeimg.com/140/140/any',
    },
    quickReplies: {
      type: 'radio', // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: '😋 Yes',
          value: 'yes',
        },
        {
          title: '📷 Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: '😞 Nope. What?',
          value: 'no',
        },
      ],
    },
  },
  {
    text: 'Hi! I work from home today!',
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'John Doe',
      avatar: 'https://placeimg.com/140/140/any',
    },
    image: 'https://placeimg.com/960/540/any',
  },
  {
    text: 'Hello developer',
    createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'John Doe',
      avatar: 'https://placeimg.com/140/140/any',
    },
  },
  {
    text: 'This is a system message',
    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
    system: true,
    user: {
      _id: 0,
    },
  },
].map((message, index) => ({
  ...message,
  _id: index + 1,
})).reverse()

export default messages
