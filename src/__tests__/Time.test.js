import 'react-native';
import React from 'react';
import createComponentWithContext from '../../tests/context';

import { Time } from '../GiftedChat';

it('should render <Time /> and compare with snapshot', () => {
  const component = createComponentWithContext(<Time />);
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
