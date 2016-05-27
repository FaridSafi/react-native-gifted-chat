'use strict';

import React, {
  Component,
} from 'react';
import {
  Navigator,
  StatusBar,
  Platform,
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

let Router = {
  GiftedMessenger() {
    return {
      getSceneClass() {
        if (Platform.OS === 'ios') {
          StatusBar.setBarStyle('light-content');
        }
        return require('./GiftedMessengerContainer');
      },
      getTitle() {
        return 'Gifted Messenger';
      },
    };
  },
};

class Navigation extends Component {
  render() {
    return (
      <ExNavigator
        initialRoute={Router.GiftedMessenger()}
        style={{flex: 1}}
        sceneStyle={{paddingTop: Navigator.NavigationBar.Styles.General.TotalNavHeight}}
        showNavigationBar={true}
        navigationBarStyle={{
          backgroundColor: '#007aff',
          borderBottomWidth: 0,
        }}
        titleStyle={{
          color: '#ffffff',
        }}
      />
    );
  }
}

module.exports = Navigation;
