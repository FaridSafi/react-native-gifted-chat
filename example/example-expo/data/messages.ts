import dayjs from 'dayjs'
import { IMessage } from 'react-native-gifted-chat'

const date1 = dayjs()
const date2 = date1.clone().subtract(1, 'day')
const date3 = date2.clone().subtract(1, 'week')

const messages: IMessage[] = [
  {
    text: '',
    createdAt: date3.toDate(),
    audio:
      'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3',
    user: {
      _id: 2,
      name: 'John Doe',
    },
  },
  {
    text: '',
    createdAt: date3.toDate(),
    video: 'https://media.giphy.com/media/3o6ZthZjk09Xx4ktZ6/giphy.mp4',
    user: {
      _id: 2,
      name: 'John Doe',
    },
  },
  {
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: date3.toDate(),
    quickReplies: {
      type: 'checkbox', // or 'checkbox',
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
    user: {
      _id: 2,
      name: 'John Doe',
    },
  },
  {
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: date3.toDate(),
    quickReplies: {
      type: 'radio', // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: '😋 Yes',
          value: 'yes',
        },
        {
          title:
            '📷 Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: '😞 Nope. What?',
          value: 'no',
        },
      ],
    },
    user: {
      _id: 2,
      name: 'John Doe',
    },
  },
  {
    text: 'Are you building a chat app?',
    createdAt: date3.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    text: 'Yes, and I use #GiftedChat!',
    createdAt: date3.toDate(),
    user: {
      _id: 2,
      name: 'John Doe',
    },
    sent: true,
    received: true,
  },
  {
    text: 'Where are you?',
    createdAt: date3.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    text: '',
    createdAt: date2.toDate(),
    user: {
      _id: 2,
      name: 'John Doe',
    },
    sent: true,
    received: true,
    location: {
      latitude: 48.864601,
      longitude: 2.398704,
    },
  },
  {
    text: 'Send me a picture!',
    createdAt: date2.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    text: 'Paris',
    createdAt: date2.toDate(),
    user: {
      _id: 2,
      name: 'John Doe',
    },
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/003/407/768/small/eiffel-tower-at-paris-france-free-photo.jpg',
    sent: true,
    received: true,
  },
  {
    text: '#awesome',
    createdAt: date1.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    text: '#awesome 2',
    createdAt: date1.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
    sent: true,
    received: true,
  },
  {
    text: '#awesome 3',
    createdAt: date1.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
    sent: true,
    received: true,
  },
  {
    text: 'Hi',
    createdAt: date1.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
    sent: true,
    received: true,
  },
  {
    text: '👋',
    createdAt: date1.toDate(),
    user: {
      _id: 1,
      name: 'Developer',
    },
    sent: true,
    received: true,
  },
].map((message, index) => ({
  ...message,
  _id: index + 1,
})).reverse()

export default messages
