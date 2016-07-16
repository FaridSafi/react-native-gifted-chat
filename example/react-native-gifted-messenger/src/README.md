# Message object

```js
message = {
  _id: Math.round(Math.random() * 1000000), // MANDATORY
  user: {
    avatar: 'https://facebook.github.io/react/img/logo_og.png',
    _id: 1, // MANDATORY
  },
  text: 'hello http://google.fr',
  createdAt: new Date(Date.UTC(2016, 5, 14, 17, 30, 0)),
  //   image: 'assets-library://asset/asset.JPG?id=99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7&ext=JPG',
  // location:
}
```
