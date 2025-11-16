import dayjs from 'dayjs'
import { IMessage } from 'react-native-gifted-chat'

const date = dayjs().subtract(1, 'year')

export default (): IMessage[] => [
  {
    _id: Math.round(Math.random() * 1000000),
    text:
      'It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text:
      'It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text:
      'It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text:
      'It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'React Native lets you build mobile apps using only JavaScript',
    createdAt: date.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'This is a system message.',
    createdAt: date.toDate(),
    system: true,
    user: {
      _id: 0,
    },
  },
]
