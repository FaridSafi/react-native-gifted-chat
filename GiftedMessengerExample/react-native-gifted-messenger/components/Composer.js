import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TextInput,
  PixelRatio,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';

// TODO
// disable CameraRollPicker by default because native module needed

class Composer extends Component {

  // required by @exponent/react-native-action-sheet
  static contextTypes = {
    actionSheet: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    }
  }

  _setModalVisible(visible) {
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
          this._setModalVisible(true);
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

  renderActionsButton() {
    if (this.props.actions === true) {
      return (
        <TouchableOpacity
          style={this.props.componentStyles.actionsButton}
          onPress={this.onActionsPress.bind(this)}
        >
          <Modal
            animationType={'slide'}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {this._setModalVisible(false)}}
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
    return null;
  }

  renderSendButton() {
    return (
      <TouchableOpacity
        style={this.props.componentStyles.sendButton}
        onPress={() => {
          if (this.props.text.trim().length > 0) {
            this.props.onSend({
              text: this.props.text.trim(),
            });
          }
        }}
      >
        <Text style={[this.props.componentStyles.sendButtonText, {
          opacity: (this.props.text.trim().length > 0 ? 1 : 0.5),
        }]}>Send</Text>
      </TouchableOpacity>
    );
  }

  renderTextInput() {
    return (
      <TextInput
        placeholder={'Type a message...'}
        multiline={true}
        onChange={this.props.onType}
        style={[this.props.componentStyles.textInput, {
          height: this.props.textInputHeight,
          marginTop: (this.props.heightMin - this.props.textInputHeightMin) / 2,
          marginBottom: (this.props.heightMin - this.props.textInputHeightMin) / 2,
        }]}
        value={this.props.text}
        enablesReturnKeyAutomatically={true}

        ref={(r) => {
          this._textInput = r;
        }}
      />
    );
  }

  renderNavBar() {
    return (
      <NavBar>
        <NavButton onPress={() => {
          this._setModalVisible(false);
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

  getSelectedImages(image) {
    console.log('selected', image);
  }

  render() {
    return (
      <View style={this.props.componentStyles.container}>
        {this.renderActionsButton()}
        {this.renderTextInput()}
        {this.renderSendButton()}
      </View>
    );
  }
}

Composer.defaultProps = {
  componentStyles: {},
  actions: false,
};

export default Composer;
