/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { Text, StyleSheet, View, ViewPropTypes } from 'react-native';

export default function QuickReplies({
  containerStyle,
  quickReplyProps,
  currentMessage,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {currentMessage.quickReplies.map((quickReply) => {
         return (
           <View style={styles.quickReply} {...quickReplyProps} key={quickReply._id}>
             <Text>{quickReply.title}</Text>
           </View>
         );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  quickReply: {
    borderWidth: 1,
    width: 150,
    height: 30,
    borderRadius: 13,
    margin: 3,
  },
});

QuickReplies.defaultProps = {
  currentMessage: {
    quickReplies: [],
  },
  containerStyle: {},
  quickReplyProps: {},
};

QuickReplies.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  quickReplyProps: PropTypes.object,
};
