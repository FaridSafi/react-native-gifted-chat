import React, {Text, View, Animated, Image, StyleSheet} from 'react-native';

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
  triangleCorner: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: '#e6e6eb'
  }
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
    return (
      <Text style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}>
        {text}
      </Text>
    );
  }

  renderTriangle(position) {
    let triangleStyles = {
      left: {
        borderTopColor: (this.props.styles.bubbleLeft.backgroundColor  || '#e6e6eb'),
        left: -10,
        bottom: 0,
        transform: [
          {rotate: '180deg'}
        ]
      },
      right: {
        borderTopColor: (this.props.styles.bubbleRight.backgroundColor || '#007aff'),
        right: -10,
        bottom: 0,
        transform: [
          {rotate: '270deg'}
        ]
      }
    }
    return (
      <View style={[styles.triangleCorner, triangleStyles[position]]}/>
    );
  }

  render(){
    var flexStyle = {};
    if ( this.props.text.length > 40 ) {
     flexStyle.flex = 1;
    }

    return (
      <View style={styles.bubbleWrapper}>
        {this.props.position === 'left' ? this.renderTriangle('left') : null}
        <View style={[styles.bubble,
          (this.props.position === 'left' ? styles.bubbleLeft : styles.bubbleRight),
          (this.props.status === 'ErrorButton' ? styles.bubbleError : null),
          flexStyle]}>
          {this.props.name}
          {this.renderText(this.props.text, this.props.position)}
        </View>
        {this.props.position === 'right' ? this.renderTriangle('right') : null}
      </View>
    )
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left','right']),
  status: React.PropTypes.string,
  text: React.PropTypes.string,
  renderCustomText: React.PropTypes.func,
  name: React.PropTypes.element
}
