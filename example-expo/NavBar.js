/* eslint jsx-a11y/accessible-emoji: 0 */
import React from 'react';
import { Text } from 'react-native';
import NavBar, { NavTitle, NavButton } from 'react-native-nav';
import { Constants } from 'expo';

export default function NavBarCustom() {
  return (
    <NavBar>
      <NavButton />
      <NavTitle>
        💬 Gifted Chat{'\n'}
        <Text style={{ fontSize: 10, color: '#aaa' }}>
          ({Constants.expoVersion})
        </Text>
      </NavTitle>
      <NavButton />
    </NavBar>
  );
}
