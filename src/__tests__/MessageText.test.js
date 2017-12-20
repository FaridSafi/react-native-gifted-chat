import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { MessageText } from '../GiftedChat';

it('should render <MessageText /> and compare with snapshot', () => {
  const tree = renderer.create(<MessageText />).toJSON();

  expect(tree).toMatchSnapshot();
});
