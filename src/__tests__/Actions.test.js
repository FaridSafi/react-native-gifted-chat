import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { Actions } from '../GiftedChat';

it('should render <Actions /> and compare with snapshot', () => {
  const tree = renderer.create(<Actions />).toJSON();

  expect(tree).toMatchSnapshot();
});
