import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, StyleSheet, View, } from 'react-native';
// TODO: support web
// @ts-ignore
import Lightbox from 'react-native-lightbox';
import { StylePropType } from './utils';
const styles = StyleSheet.create({
    container: {},
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover',
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
});
export default class MessageImage extends Component {
    render() {
        const { containerStyle, lightboxProps, imageProps, imageStyle, currentMessage, } = this.props;
        if (!!currentMessage) {
            return (<View style={[styles.container, containerStyle]}>
          <Lightbox activeProps={{
                style: styles.imageActive,
            }} {...lightboxProps}>
            <Image {...imageProps} style={[styles.image, imageStyle]} source={{ uri: currentMessage.image }}/>
          </Lightbox>
        </View>);
        }
        return null;
    }
}
MessageImage.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
MessageImage.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: StylePropType,
    imageStyle: StylePropType,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
};
//# sourceMappingURL=MessageImage.js.map