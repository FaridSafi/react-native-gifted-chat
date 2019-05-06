import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { SystemMessage } from '../GiftedChat';

it('should render <SystemMessage /> and compare with snapshot', () => {
  const tree = renderer.create(<SystemMessage />).toJSON();

  expect(tree).toMatchSnapshot();
});
