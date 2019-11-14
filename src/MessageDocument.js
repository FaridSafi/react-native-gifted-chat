import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native'
import { images } from '../../../src/config'
// @ts-ignore
const styles = StyleSheet.create({
  container: {},
  image: {
    width: 30,
    height: 30,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
})
export default class MessageDocument extends Component {
  render() {
    const {
      containerStyle,
      documentProps,
      documentStyle,
      currentMessage,
    } = this.props
    const { document, docx, htm, html, pdf, ppt, pptx, txt, xls, xlsx } = images
    let isServerDocs ;
    documentImage = value => {
      const fileName = value && value.name ? value.name : value
      const fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1)
      switch (fileExtension) {
        case 'doc':
          return document
          break
        case 'docx':
          return docx
          break
        case 'htm':
          return htm
          break
        case 'html':
          return html
          break
        case 'pdf':
          return pdf
          break
        case 'ppt':
          return ppt
          break
        case 'pptx':
          return pptx
        case 'txt':
          return txt
          break
        case 'xls':
          return xls
          break
        case 'xlsx':
          return xlsx
          break
        default:
          return null
      }
    }
    if (!!currentMessage) {
let isServerDocs = currentMessage.document && currentMessage.document.name ?  false : true 
      return (
        <View style={[styles.container, containerStyle]}>
          <TouchableOpacity
            onPress={() => Linking.openURL(currentMessage.document)}
          >
            <View
              style={{
                flexDirection: 'row',
                width: 200,
                height: 25,
                margin: 5,
                alignItems: 'center',
              }}
            >
              <Image
                {...documentProps}
                style={[styles.image, documentStyle]}
                source={documentImage(currentMessage.document)}
              />
              <Text numberOfLines={1} style={{ width : 130}}>
                { currentMessage.document &&  currentMessage.document.name ? currentMessage.document.name : currentMessage.document}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }
}
MessageDocument.defaultProps = {
  currentMessage: {
    document: null,
  },
  containerStyle: {},
  documentStyle: {},
  documentProps: {},
  lightboxProps: {},
}
MessageDocument.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  documentStyle: PropTypes.object,
  documentProps: PropTypes.object,
  lightboxProps: PropTypes.object,
}
//# sourceMappingURL=MessageDocument.js.map
