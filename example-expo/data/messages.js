export default [
  // {
  //   _id: 7,
  //   text: '#awesome',
  //   createdAt: new Date(),
  //   user: {
  //     _id: 1,
  //     name: 'Developer',
  //   },
  // },
  // {
  //   _id: 6,
  //   text: 'Paris',
  //   createdAt: new Date(),
  //   user: {
  //     _id: 2,
  //     name: 'React Native',
  //   },
  //   image:
  //     'https://lh3.googleusercontent.com/-uXipYA5hSKc/VVWKiFIvo-I/AAAAAAAAAhQ/vkjLyZNEzUA/w800-h800/1.jpg',
  //   sent: true,
  //   received: true,
  // },
  // {
  //   _id: 5,
  //   text: 'Send me a picture!',
  //   createdAt: new Date(),
  //   user: {
  //     _id: 1,
  //     name: 'Developer',
  //   },
  // },
  // {
  //   _id: 4,
  //   text: '',
  //   createdAt: new Date(),
  //   user: {
  //     _id: 2,
  //     name: 'React Native',
  //   },
  //   sent: true,
  //   received: true,
  //   location: {
  //     latitude: 48.864601,
  //     longitude: 2.398704,
  //   },
  // },
  // {
  //   _id: 3,
  //   text: 'Where are you?',
  //   createdAt: new Date(),
  //   user: {
  //     _id: 1,
  //     name: 'Developer',
  //   },
  // },
  // {
  //   _id: 2,
  //   text: 'Yes, and I use #GiftedChat!',
  //   createdAt: new Date(),
  //   user: {
  //     _id: 2,
  //     name: 'React Native',
  //   },
  //   sent: true,
  //   received: true,
  // },
  // {
  //   _id: 1,
  //   text: 'Are you building a chat app?',
  //   createdAt: new Date(),
  //   user: {
  //     _id: 1,
  //     name: 'Developer',
  //   },
  // },
  {
    _id: 1,
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: new Date(),
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
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 2,
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: new Date(),
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
  // {
  //   _id: 9,
  //   text: 'You are officially rocking GiftedChat.',
  //   createdAt: new Date(),
  //   system: true,
  // },
]
