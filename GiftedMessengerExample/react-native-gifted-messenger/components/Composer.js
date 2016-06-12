import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
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

  onAccessory() {
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

  renderAccessoryButton() {
    return (
      <TouchableOpacity
        style={styles.accessoryButton}
        onPress={this.onAccessory.bind(this)}
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
            width: 30 * 60 / 66,
            height: 30,
            tintColor: '#ccc'
          }}
          resizeMode="contain"
          source={require('../assets/paperclip.png')}
        />
      </TouchableOpacity>
    );
  }

  renderSendButton() {
    return (
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => {
          if (this.props.text.trim().length > 0) {
            this.props.onSend({
              text: this.props.text.trim(),
            });
          }
        }}
      >
        <Text style={[styles.sendButtonText, {
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
        style={[styles.textInput, {
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
      <View style={styles.container}>
        {this.renderAccessoryButton()}
        {this.renderTextInput()}
        {this.renderSendButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    // paddingLeft: 15,
    marginLeft: 10,
    fontSize: 17,
  },
  accessoryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    // borderRadius: 15,
    // borderWidth: 2,
    // borderColor: '#6699CC',
    marginLeft: 10,
    marginBottom: 12,
  },
  accessoryText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20,
    color: '#6699CC',
  },
  sendButton: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 17,
  },
  sendButtonText: {
    color: '#6699CC',
    fontWeight: '600',
    fontSize: 17,
  },
});

export default Composer;
