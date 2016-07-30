module.exports = [
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'In 10 minutes',
    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 40, 0)),
    image: 'https://facebook.github.io/react/img/logo_og.png',
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: 'Place Gambetta',
    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 30, 0)),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    location: {
      latitude: 48.864601,
      longitude: 2.398704
    },
    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'Developer',
    },
  },
];
