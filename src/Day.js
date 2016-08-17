import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

export default class Day extends React.Component {
  dayFormat() {
    if( this.props.dayFormat ) {
      var locale = this.context.getLocale();
      return this.props.dayFormat[locale] || this.props.dayFormat;
    } else {
      return null;
    }
  }

  render() {
    if (!this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
      return (
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.text, this.props.textStyle]}>
              {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).calendar(null, this.dayFormat()).toUpperCase()}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    // backgroundColor: '#ccc',
    // borderRadius: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: 5,
    // paddingBottom: 5,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#b2b2b2',
    fontSize: 12,
    fontWeight: '600',
  },
});

Day.contextTypes = {
  getLocale: React.PropTypes.func,
};

Day.defaultProps = {
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  isSameDay: () => {},
  currentMessage: {
    // TODO test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
  dayFormat: {
    sameDay: 'll',
    nextDay: 'll',
    lastDay: 'll',
    nextWeek: 'll',
    lastWeek: 'll',
    sameElse: 'll',
  },
};

Day.propTypes = {
  containerStyle: React.PropTypes.object,
  wrapperStyle: React.PropTypes.object,
  textStyle: React.PropTypes.object,
  isSameDay: React.PropTypes.func,
  currentMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  dayFormat: React.PropTypes.object,
};
