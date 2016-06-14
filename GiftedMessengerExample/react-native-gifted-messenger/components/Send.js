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
          if (this.props.text.trim().length > 0) {
            this.props.onSend({
              text: this.props.text.trim(),
            });
          }
        }}
      >
        <Text style={[this.props.customStyles.Send.text, {
          opacity: (this.props.text.trim().length > 0 ? 1 : 0.5),
        }]}>Send</Text>
      </TouchableOpacity>
    );
  }
}

export default Send;
