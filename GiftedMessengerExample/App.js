import React, { Component } from 'react';
import {
  Image,
  View,
} from 'react-native';

import {
  GiftedMessenger,
  Actions,
  Avatar,
  Bubble,
  BubbleImage,
  BubbleText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Location,
  Message,
  Send,
  Time,
  DefaultStyles,
} from './react-native-gifted-messenger';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        messages: [
          {
            id: Math.round(Math.random() * 1000000),
            user: {
              avatar: 'https://facebook.github.io/react/img/logo_og.png',
              id: 1,
            },
            text: 'hello http://google.fr',
            time: new Date(Date.UTC(2016, 5, 14, 17, 30, 0)),
          },
          {
            id: Math.round(Math.random() * 1000000),
            user: {
              avatar: 'https://facebook.github.io/react/img/logo_og.png',
              id: 1,
            },
            image: 'assets-library://asset/asset.JPG?id=99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7&ext=JPG',
            time: new Date(Date.UTC(2016, 5, 13, 17, 30, 0)),
          },
          {
            id: Math.round(Math.random() * 1000000),
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            time: new Date(Date.UTC(2016, 5, 11, 17, 30, 0)),
            user: {
              id: 2,
              name: 'Farid Safi',
            },
          },
          {
            id: Math.round(Math.random() * 1000000),
            text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
            time: new Date(Date.UTC(2016, 5, 11, 17, 30, 0)),
            user: {
              avatar: 'https://facebook.github.io/react/img/logo_og.png',
              id: 1,
            },
          },
        ]
      });
    }, 0); // simulating network

  }

  componentDidMount() {
    // setTimeout(() => {
    //   const messages = this.state.messages.slice(0);
    //   messages.shift();
    //
    //   this.setState({
    //     messages: messages,
    //   })
    // }, 2000);

    //
    // setTimeout(() => {
    //   this.setState({
    //     messages: GiftedMessenger.append(this.state.messages, {
    //       text: 'Hello Farid',
    //       time: new Date(),
    //       user: {
    //         id: 1,
    //         name: 'React Native',
    //         avatar: 'https://facebook.github.io/react/img/logo_og.png',
    //       },
    //       id: Math.round(Math.random() * 1000000),
    //     }),
    //   });
    // }, 2000);
  }

  render() {
    return (
      <GiftedMessenger
        locale={'fr'}
        customStyles={DefaultStyles}

        messages={this.state.messages}
        onSend={this.onSend.bind(this)}

        loadEarlier={true}
        onLoadEarlier={this.onLoadEarlier.bind(this)}

        user={{
          id: 2,
          name: 'Farid Safi',
          // avatar:
        }}

        renderActions={(props) => {
          // icon={() => {
          //   return (
          //     <Image
          //       style={{
          //         width: 20,
          //         height: 20,
          //       }}
          //       source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
          //     />
          //   );
          // }}
          return (
            <Actions
              {...props}
            />
          );
        }}
        renderAvatar={(props) => {
          return (
            <Avatar {...props} onPress={(user) => {
              console.log(user);
            }}/>
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble {...props}/>
          );
        }}
        renderBubbleImage={(props) => {
          return (
            <BubbleImage {...props}/>
          );
        }}
        renderBubbleText={(props) => {
          return (
            <BubbleText {...props}/>
          );
        }}
        renderComposer={(props) => {
          return (
            <Composer {...props}/>
          );
        }}
        renderDay={(props) => {
          return (
            <Day {...props}/>
          );
        }}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar {...props}/>
          );
        }}
        renderLoadEarlier={(props) => {
          return (
            <LoadEarlier
              {...props}
              // `onLoadEarlier` SHOULD NOT BE PASSED HERE i think
            />
          );
        }}
        renderLocation={(props) => {
          return (
            <Location {...props}/>
          );
        }}
        renderMessage={(props) => {
          return (
            <Message {...props}/>
          );
        }}
        renderSend={(props) => {
          return (
            <Send {...props}/>
          );
        }}
        renderTime={(props) => {
          return (
            <Time {...props}/>
          );
        }}
      />
    );
  }


  // TODO
  // handle receive


  onSend(messages = []) {

    // messages have a temporary id tempId

    /* Send the message(s) to your server here */

    // setTimeout(() => {
    //   // Update the temporary key
    //   // Why ? TODO
    //
    //   // TODO test render triggering opti
    //   this.setState({
    //     messages: GiftedMessenger.update(this.state.messages, [
    //       {
    //         find: {
    //           tempId: 1000,
    //         },
    //         set: {
    //           id: 1001,
    //         }
    //       }
    //     ]),
    //   });
    // }, 1000); // simulating networking

    this.setState({
      messages: GiftedMessenger.append(this.state.messages, messages),
    });

  }

  onLoadEarlier() {
    this.setState({
      messages: GiftedMessenger.prepend(this.state.messages, [
        {
          id: Math.round(Math.random() * 1000000),
          // position: 'right',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

          time: new Date(Date.UTC(2016, 5, 9, 17, 30, 0)),
          user: {
            id: 2,
            name: 'Farid Safi',
          },
        },
        {
          id: Math.round(Math.random() * 1000000),
          // position: 'left',
          text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',

          time: new Date(Date.UTC(2016, 5, 9, 17, 30, 0)),
          user: {
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
            id: 1,
          },
        },
        {
          id: Math.round(Math.random() * 1000000),
          // position: 'left',
          text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',

          time: new Date(Date.UTC(2016, 5, 9, 17, 30, 0)),
          user: {
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
            id: 1,
          },
        },
      ]),
    });
  }
}

export default App;
