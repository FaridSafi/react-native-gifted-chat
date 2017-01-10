import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Lightbox from 'react-native-lightbox';

export default class MessageImage extends React.Component {
  render() {
    const { width, height } = Dimensions.get('window');

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Lightbox
          navigator={this.props.navigator}
          activeProps={{
            style: [styles.imageActive, { width, height }],
          }}
        >
          <Image
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={{uri: this.props.currentMessage.image}}
          />
        </Lightbox>
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
  imageActive: {
    resizeMode: 'contain',
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  navigator: null,
};

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: React.PropTypes.object,
  navigator: React.PropTypes.object,
};
