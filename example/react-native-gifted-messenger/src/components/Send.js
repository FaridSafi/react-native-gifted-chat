import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';

class Send extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.customStyles.Send.container}
        onPress={() => {
          this.props.onSend({text: this.props.text.trim()}, true);
        }}
        disabled={this.props.text.trim().length > 0 ? false : true}
      >
        <Text style={[this.props.customStyles.Send.text, {
          opacity: (this.props.text.trim().length > 0 ? 1 : 0.5),
        }]}>Send</Text>
      </TouchableOpacity>
    );
  }
}

Send.defaultProps = {
  customStyles: {},
  text: '',
  onSend: () => {},
};

export default Send;
