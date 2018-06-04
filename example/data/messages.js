module.exports = [
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'Yes, and I use Gifted Chat!',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'Developer',
    },
    sent: true,
    received: true,
    // location: {
    //   latitude: 48.864601,
    //   longitude: 2.398704
    // },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'Are you building a chat app?',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: "You are officially rocking GiftedChat.",
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    system: true,
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: "This is a quick reply. Do you love Gifted Chat?",
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    quickReplies: [
      {
        _id: Math.round(Math.random() * 1000000),
        contentType: "text",
        title: "😋 Yes"
      },
      {
        _id: Math.round(Math.random() * 1000000),
        contentType: "camera",
        title: "📷 Yes, let me show you with a picture!",
      },
      {
        _id: Math.round(Math.random() * 1000000),
        contentType: "text",
        title: "😞 Nope. Whaaaaaat?",
      }
    ],
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
];
