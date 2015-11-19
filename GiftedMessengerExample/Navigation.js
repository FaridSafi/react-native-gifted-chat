'use strict';

var React = require('react-native');
var {
  Text,
  Navigator,
  Platform
} = React;

var Navigation = React.createClass({
  render() {
    return (
      <Navigator
        initialRoute={{index: 0, title: 'Gifted Messenger'}}
        renderScene={this.renderScene}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        
        sceneStyle={{paddingTop: (Platform.OS === 'android' ? 56 : 64)}}
        
        navigationBar={this._renderNavBar()}
      />
    );
  },
  _renderNavBar() {
    var _self = this;    
    var routeMapper = {
      LeftButton(route, navigator, index, navState) {
        return null;
      },
      RightButton(route, navigator, index, navState) {
        return null;
      },
      Title(route, navigator, index, navState) {
        return null;
      }
    };
    return (
      <Navigator.NavigationBar
        style={{
          backgroundColor: '#007aff',
          alignItems: 'center',        
        }}
        routeMapper={routeMapper}
      />
    );
  },
  renderScene(route, navigator) {
    var GiftedMessengerExample = require('./GiftedMessengerExample');
    return (
      <GiftedMessengerExample />
    );
  },
});


module.exports = Navigation;