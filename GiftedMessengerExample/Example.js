import React, { Component } from 'react';

import {
  GiftedMessenger,
  Message,
} from './react-native-gifted-messenger/GiftedMessenger';

class Example extends Component {
  render() {
    return (
      <GiftedMessenger
        messages={[
          () => <Message key={1} text={'key={1}'} />,
          () => <Message key={2} text={'key={2}'} />,
          () => <Message key={3} text={'key={3}'} />,
          () => <Message key={4} text={'key={4}'} />,
          () => <Message key={5} text={'key={5}'} />,
          () => <Message key={6} text={'key={6}'} />,
          () => <Message key={7} text={'key={7}'} />,
          () => <Message key={8} text={'key={8}'} />,
          () => <Message key={9} text={'key={9}'} />,
          () => <Message key={10} text={'key={10}'} />,
          () => <Message key={11} text={'key={11}'} />,
          () => <Message key={12} text={'key={12}'} />,
          () => <Message key={13} text={'key={13}'} />,
          () => <Message key={14} text={'key={14}'} />,
          () => <Message key={15} text={'key={15}'} />,
          () => <Message key={16} text={'key={16}'} />,
          () => <Message key={17} text={'key={17}'} />,
          () => <Message key={18} text={'key={18}'} />,
          () => <Message key={19} text={'key={19}'} />,
          () => <Message key={20} text={'key={20}'} />,

        ]}
      />
    );
  }
}

export default Example;
