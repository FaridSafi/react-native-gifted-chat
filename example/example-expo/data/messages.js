import dayjs from 'dayjs'

const date1 = dayjs()
const date2 = date1.clone().subtract(1, 'day')
const date3 = date2.clone().subtract(1, 'week')

export default [
  {
    _id: 9,
    text: '#awesome 3',
    createdAt: date1,
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 8,
    text: '#awesome 2',
    createdAt: date1,
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 7,
    text: '#awesome',
    createdAt: date1,
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 6,
    text: 'Paris',
    createdAt: date2,
    user: {
      _id: 2,
      name: 'React Native',
    },
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg/280px-Paris_-_Eiffelturm_und_Marsfeld2.jpg',
    sent: true,
    received: true,
  },
  {
    _id: 5,
    text: 'Send me a picture!',
    createdAt: date2,
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 4,
    text: '',
    createdAt: date2,
    user: {
      _id: 2,
      name: 'React Native',
    },
    sent: true,
    received: true,
    location: {
      latitude: 48.864601,
      longitude: 2.398704,
    },
  },
  {
    _id: 3,
    text: 'Where are you?',
    createdAt: date3,
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 2,
    text: 'Yes, and I use #GiftedChat!',
    createdAt: date3,
    user: {
      _id: 2,
      name: 'React Native',
    },
    sent: true,
    received: true,
  },
  {
    _id: 1,
    text: 'Are you building a chat app?',
    createdAt: date3,
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: 10,
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: date3,
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
            '📷 Yes, let me show you with a picture! Again let me show you with a picture!',
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
      name: 'React Native',
    },
  },
  {
    _id: 20,
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: date3,
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
      name: 'React Native',
    },
  },
  {
    _id: 30,
    createdAt: date3,
    video: 'https://media.giphy.com/media/3o6ZthZjk09Xx4ktZ6/giphy.mp4',
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 31,
    createdAt: date3,
    audio:
      'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3',
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
]
