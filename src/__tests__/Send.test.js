import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { Send } from '../GiftedChat';

it('should render <Send /> and compare with snapshot', () => {
  const tree = renderer.create(<Send />).toJSON();

  expect(tree).toMatchSnapshot();
});
