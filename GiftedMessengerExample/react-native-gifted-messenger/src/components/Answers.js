import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

class Answers extends Component {
  constructor(props) {
    super(props);
  }

  onPress(answer) {
    if (this.props.customOnAnswerPress) {
      this.props.customOnAnswerPress(answer);
    }
    return this.props.onAnswerPress(answer);
  }

  renderAnswers() {
    if (this.props.answers) {
      return this.props.answers.map((answer, index) => {
        return (
          <TouchableHighlight
            key={`answer-${index}`}
            underlayColor="transparent"
            onPress={() => this.onPress(answer)}
            style={[this.props.customStyles.Answers.answer]}
          >
          <Text>{answer.text}</Text>
          </TouchableHighlight>
        )
      });
    }
    return null;
  }

  render() {
    return (
      <View
        style={[this.props.customStyles.Answers.container]}
      >
        {this.renderAnswers()}
      </View>
    );
  }
}

Answers.defaultProps = {
  onPress: (answer) => {},
  customStyles: {},
};

export default Answers;
