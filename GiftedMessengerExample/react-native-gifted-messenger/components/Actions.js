import React, { Component, PropTypes } from 'react';
import {
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import CameraRollPicker from 'react-native-camera-roll-picker';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';

class Actions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  // required by @exponent/react-native-action-sheet
  static contextTypes = {
    actionSheet: PropTypes.func,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onActionsPress() {
    let options = ['Take Photo', 'Choose From Library', 'Send Location', 'Cancel'];
    let cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          this.setModalVisible(true);
          break;
        case 2:
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.props.onSend({
                location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
              });
            },
            (error) => alert(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
          );
          break;
        default:
      }
    });
  }

  getSelectedImages(image) {
    console.log('selected', image);
  }

  // TODO
  // use theme styles
  renderNavBar() {
    return (
      <NavBar>
        <NavButton onPress={() => {
          this.setModalVisible(false);
        }}>
          <NavButtonText>
            Cancel
          </NavButtonText>
        </NavButton>
        <NavTitle>
          Camera Roll
        </NavTitle>
        <NavButton>
          <NavButtonText>
            Send
          </NavButtonText>
        </NavButton>
      </NavBar>
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={this.props.theme.Actions.container}
        onPress={this.onActionsPress.bind(this)}
      >
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          {this.renderNavBar()}
          <CameraRollPicker
            maximum={10}
            imagesPerRow={4}
            callback={this.getSelectedImages.bind(this)}
          />
        </Modal>

        <Image
          style={{
            width: 27,
            height: 30,
            tintColor: '#ccc'
          }}
          resizeMode="contain"
          source={require('../assets/paperclip.png')}
        />
      </TouchableOpacity>
    );
  }
}

export default Actions;
