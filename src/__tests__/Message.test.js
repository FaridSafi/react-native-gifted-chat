import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { Message } from '../GiftedChat';

it('should render <Message /> and compare with snapshot', () => {
  const tree = renderer
    .create(<Message user={{ _id: 1 }} currentMessage={{ user: { _id: 1 } }} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
