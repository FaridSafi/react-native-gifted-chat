import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

export default class MessageImage extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Image
          style={[styles.image, this.props.imageStyle]}
          source={{uri: this.props.currentMessage.image}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
});

MessageImage.defaultProps = {
  containerStyle: {},
  imageStyle: {},
  currentMessage: {
    image: null,
  },
};

MessageImage.propTypes = {
  containerStyle: React.PropTypes.object,
  imageStyle: React.PropTypes.object,
  currentMessage: React.PropTypes.object,
};
