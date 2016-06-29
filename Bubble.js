import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import ParsedText from 'react-native-parsed-text';

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 15,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 10,
    paddingTop: 8,
  },
  text: {
    color: '#000',
  },
  textLeft: {
  },
  textRight: {
    color: '#fff',
  },
  textCenter: {
    textAlign: 'center',
  },
  bubbleLeft: {
    marginRight: 70,
    backgroundColor: '#e6e6eb',
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    marginLeft: 70,
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
  },
  bubbleCenter: {
    backgroundColor: '#007aff',
    alignSelf: 'center',
  },
  bubbleError: {
    backgroundColor: '#e01717',
  },
});

export default class Bubble extends React.Component {

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderText(text = '', position) {
    if (this.props.renderCustomText) {
      return this.props.renderCustomText(this.props);
    }

    if (this.props.parseText === true) {
      return (
        <ParsedText
          style={[styles.text, (position === 'left' ? styles.textLeft : position === 'right' ? styles.textRight : styles.textCenter)]}
          parse={
            [
              {
                type: 'url',
                style: {
                  textDecorationLine: 'underline',
                },
                onPress: this.props.handleUrlPress,
              },
              {
                type: 'phone',
                style: {
                  textDecorationLine: 'underline',
                },
                onPress: this.props.handlePhonePress,
              },
              {
                type: 'email',
                style: {
                  textDecorationLine: 'underline',
                },
                onPress: this.props.handleEmailPress,
              },
              {
                pattern: /(<(b)>[^<]*(<([^>]+)>))/ig,
                style: {
                  fontWeight: 'bold'
                }
              },
              {
                pattern: /(<(u)>[^<]*(<([^>]+)>))/ig,
                style: {
                  textDecorationLine: 'underline'
                }
              },
            ]
          }
        >
          {text}
        </ParsedText>
      );
    }

    return (
      <Text style={[styles.text, (position === 'left' ? styles.textLeft : position === 'right' ? styles.textRight : styles.textCenter)]}>
        {text}
      </Text>
    );
  }

  render() {
    const flexStyle = {};
    if (this.props.text) {
      if (this.props.text.length > 40) {
        flexStyle.flex = 1;
      }
    }

    return (
      <View style={[styles.bubble,
        (this.props.position === 'left' ? styles.bubbleLeft : this.props.position === 'right' ? styles.bubbleRight : styles.bubbleCenter),
        (this.props.status === 'ErrorButton' ? styles.bubbleError : null),
        flexStyle]}
      >
        {this.props.name}
        {this.renderText(this.props.text, this.props.position)}
      </View>
  );
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right', 'center']),
  status: React.PropTypes.string,
  text: React.PropTypes.string,
  renderCustomText: React.PropTypes.func,
  styles: React.PropTypes.object,
  parseText: React.PropTypes.bool,
  name: React.PropTypes.element,
  handleUrlPress: React.PropTypes.func,
  handlePhonePress: React.PropTypes.func,
  handleEmailPress: React.PropTypes.func,
};
