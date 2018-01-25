import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { MessageImage } from '../GiftedChat';

it('should render <MessageImage /> and compare with snapshot', () => {
  const tree = renderer.create(<MessageImage />).toJSON();

  expect(tree).toMatchSnapshot();
});
