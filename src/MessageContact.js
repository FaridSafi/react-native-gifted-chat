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
import { Icon } from 'native-base'
// @ts-ignore
const styles = StyleSheet.create({
  container: {},
  image: {
    width: 30,
    height: 30,
    margin: 3,
    resizeMode: 'cover',
  },
})
export default class MessageContact extends Component {
  render() {
    const {
      containerStyle,
      contactProps,
      contactStyle,
      currentMessage,
    } = this.props;
    if (!!currentMessage) {
      console.log(currentMessage , "logging message from contact compoent gifted chat");
      const phonenumber = currentMessage.contact.phoneNumbers && currentMessage.contact.phoneNumbers.length > 0 && currentMessage.contact.phoneNumbers[0].number ? currentMessage.contact.phoneNumbers[0].number : null ;
      const LabelName = currentMessage.contact.displayName ; 
      return (
        <View style={[styles.container, containerStyle]}>
          <TouchableOpacity
            onPress={() =>
              phonenumber != null ?
              Linking.openURL(`tel: ${phonenumber}`) : alert('phone number doesnot exist.')
            }
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
              {/* <Image
                {...contactProps}
                style={[styles.image, contactStyle]}
                source={{uri: }}
              /> */}
              <Icon
                {...contactProps}
                type='Ionicons'
                name='ios-contact'
                style={[styles.image, contactStyle]}
              />
              <Text style={{ margin: 3, paddingLeft: 5 }}>
                {LabelName}
              </Text>
            </View>
            {
              phonenumber ? 
              (<View style={{flexDirection : 'row'}}>
              <View style={{width : 50}}/>
              <Text >
                {phonenumber}
              </Text>
               </View>)
               : null
            }
         
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }
}
MessageContact.defaultProps = {
  currentMessage: {
    contact: null,
  },
  containerStyle: {},
  contactStyle: {},
  contactProps: {},
  lightboxProps: {},
}
MessageContact.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  contactStyle: PropTypes.object,
  contactProps: PropTypes.object,
  lightboxProps: PropTypes.object,
}
//# sourceMappingURL=MessageContact.js.map
