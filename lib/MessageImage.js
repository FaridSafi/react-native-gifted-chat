import React from 'react';
import { Image, StyleSheet, View, } from 'react-native';
// TODO: support web
import Lightbox from 'react-native-lightbox-v2';
import stylesCommon from './styles';
const styles = StyleSheet.create({
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
export function MessageImage({ containerStyle, lightboxProps, imageProps, imageSourceProps, imageStyle, currentMessage, }) {
    if (currentMessage == null)
        return null;
    return (<View style={containerStyle}>
      {/* @ts-expect-error: Lightbox types are not fully compatible */}
      <Lightbox activeProps={{
            style: [stylesCommon.fill, styles.imageActive],
        }} {...lightboxProps}>
        <Image {...imageProps} style={[styles.image, imageStyle]} source={{ ...imageSourceProps, uri: currentMessage.image }}/>
      </Lightbox>
    </View>);
}
//# sourceMappingURL=MessageImage.js.map