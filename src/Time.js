import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

export default class Time extends React.Component {
  render() {
    const  {isRead} = this.props.currentMessage;
    let isReadElement = <Image
      source={isRead ? require('./../../../assets/images/IconCheckGreen.png') : null}
      style={{
        width: 8, height: 5.82,
        marginLeft: 4,
      }}
    />


    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <Text style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}>
          {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('LT')}
        </Text>
        {isReadElement}
      </View>
    );
  }
}

const containerStyle = {
  marginLeft: 20,
  marginRight: 20,
  marginBottom: 5,
  flexDirection: 'row',
  alignItems: 'center',
};

const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  textAlign: 'left',
  color: '#979AA8',
  fontFamily: 'OpenSans-Light', fontSize: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#aaa',
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#fff',
      ...textStyle,
    },
  }),
};

Time.contextTypes = {
  getLocale: React.PropTypes.func,
};

Time.defaultProps = {
  position: 'left',
  currentMessage: {
    createdAt: null,
  },
  containerStyle: {},
  textStyle: {},
};

Time.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  textStyle: React.PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
};
