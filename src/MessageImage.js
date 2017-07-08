import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import LightBox from 'react-native-lightbox';
import PhotoView from 'react-native-photo-view';

export default class MessageImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgWidth: new Animated.Value(200),
      imgHeight: new Animated.Value(200),
    }
  }

  componentDidMount() {
    const { image } = this.props.currentMessage;
    Image.getSize(image, (imgWidth, imgHeight) => {
      const scaleRatio = 200/imgWidth;

      Animated.timing(          // Uses easing functions
        this.state.imgWidth,    // The value to drive
        {toValue: imgWidth * scaleRatio}            // Configuration
      ).start();

      Animated.timing(          // Uses easing functions
        this.state.imgHeight,    // The value to drive
        {toValue: imgHeight * scaleRatio}            // Configuration
      ).start();
    });

  }
  render() {
    const { width, height } = Dimensions.get('window');
    const { imgWidth, imgHeight } = this.state;
    const { image } = this.props.currentMessage;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <LightBox
          renderContent={() => {
            return <PhotoView
              source={{uri: image}}
              resizeMode={'contain'}
              minimumZoomScale={1}
              maximumZoomScale={3}
              androidScaleType="center"
              style={{
                width,
                height,
                flex: 1
              }}
            />;
          }}
        >
        <Animated.Image
          style={[styles.image, this.props.imageStyle, { width: imgWidth, height: imgHeight, }]}
          source={{uri: image}}
        />
        </LightBox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 2,
  },
  image: {
    width: 150,
    height: 100,
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
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
};
