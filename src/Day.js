/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import moment from 'moment';

import Colors from './Colors';

import { isSameDay, isSameUser, warnDeprecated } from './utils';

export default function Day() {
  const { dateFormat } = this.props;

  if (!isSameDay(this.props.currentMessage, this.props.previousMessage)) {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={this.props.wrapperStyle}>
          <Text style={[styles.text, this.props.textStyle]}>
            {moment(this.props.currentMessage.createdAt)
              .locale(this.context.getLocale())
              .format(dateFormat)
              .toUpperCase()}
          </Text>
        </View>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Colors.backgroundTransparent,
    color: Colors.defaultColor,
    fontSize: 12,
    fontWeight: '600',
  },
});

Day.contextTypes = {
  getLocale: PropTypes.func,
};

Day.defaultProps = {
  currentMessage: {
    // TODO: test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  // TODO: remove in next major release
  isSameDay: warnDeprecated(isSameDay),
  isSameUser: warnDeprecated(isSameUser),
};

Day.propTypes = {
  currentMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  // TODO: remove in next major release
  isSameDay: PropTypes.func,
  isSameUser: PropTypes.func,
  dateFormat: PropTypes.string.isRequired,
};
