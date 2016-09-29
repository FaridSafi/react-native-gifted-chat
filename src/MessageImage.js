import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';

export default class MessageImage extends React.Component {
  render() {
    return (
      <TouchableOpacity 
        onPress={() => this.props.onPressImage(this.props.currentMessage.image)}
      >
        <View style={[styles.container, this.props.containerStyle]}>
          <Image
            style={[styles.image, this.props.imageStyle]}
            source={{uri: this.props.currentMessage.image}}
          />
        </View>
      </TouchableOpacity>
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
  onPressImage: () => console.log('ONPRESS')
};

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
  onPressImage: React.PropTypes.func
};
