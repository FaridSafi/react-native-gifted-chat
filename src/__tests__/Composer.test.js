import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { Composer } from '../GiftedChat';

it('should render <Composer /> and compare with snapshot', () => {
  const tree = renderer.create(<Composer />).toJSON();

  expect(tree).toMatchSnapshot();
});
