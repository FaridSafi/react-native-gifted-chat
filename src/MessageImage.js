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
          {...this.props.imageProps}
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
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
};

MessageImage.propTypes = {
  imageProps: React.PropTypes.objectOf(...Image.propTypes),
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
};
