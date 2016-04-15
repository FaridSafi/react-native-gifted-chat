import React, {Text, View, Animated, Image, StyleSheet} from 'react-native';

import ParsedText from 'react-native-parsed-text';

let styles = StyleSheet.create({
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
  bubbleLeft: {
    marginRight: 70,
    backgroundColor: '#e6e6eb',
    alignSelf: "flex-start",
  },
  bubbleRight: {
    marginLeft: 70,
    backgroundColor: '#007aff',
    alignSelf: "flex-end"
  },
  bubbleError: {
    backgroundColor: '#e01717'
  },

});

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderText(text = "", position) {
    if (this.props.renderCustomText) {
      return this.props.renderCustomText(this.props);
    }
    
    if (this.props.parseText === true) {
      return (
        <ParsedText
          style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}
          parse={
            [
              {type: 'url', style: {textDecorationLine: 'underline'}, onPress: this.props.handleUrlPress},
              {type: 'phone', style: {textDecorationLine: 'underline'}, onPress: this.props.handlePhonePress},
              {type: 'email', style: {textDecorationLine: 'underline'}, onPress: this.props.handleEmailPress},
            ]
          }
        >
          {text}
        </ParsedText>
      );      
    }
    
    return (
      <Text style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}>
        {text}
      </Text>
    );
  }

  render(){
    var flexStyle = {};
    if (this.props.text) {
      if (this.props.text.length > 40) {
        flexStyle.flex = 1;
      }      
    }

    return (
      <View style={[styles.bubble,
        (this.props.position === 'left' ? styles.bubbleLeft : styles.bubbleRight),
        (this.props.status === 'ErrorButton' ? styles.bubbleError : null),
        flexStyle]}>
        {this.props.name}
        {this.renderText(this.props.text, this.props.position)}
      </View>
    )
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right']),
  status: React.PropTypes.string,
  text: React.PropTypes.string,
  renderCustomText: React.PropTypes.func,
  name: React.PropTypes.element
}
