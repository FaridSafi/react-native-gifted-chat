import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
  TouchableOpacity,
  Linking,
  Text
} from 'react-native';
import GoogleAddressing from '../../../src/utils/googleAddressing';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
// @ts-ignore
const styles = StyleSheet.create({
  container: {},
  image: {
    width: 200,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover'
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain'
  },
  calendarImage: {
    width: 200,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'contain'
  }
});
export default class MessageLocation extends Component {

  openMessage(isEvent , URL){
    const {currentMessage} = this.props;
    if(isEvent){
      let eventConfig = {
        title : currentMessage.location.eventDetail.title ? currentMessage.location.eventDetail.title : null,
        startDate  : currentMessage.location.eventDetail.startDate ? currentMessage.location.eventDetail.startDate : null,
        endDate : currentMessage.location.eventDetail.endDate ? currentMessage.location.eventDetail.endDate : null,
        location : currentMessage.location.eventDetail.location ? currentMessage.location.eventDetail.location : null,
        description : currentMessage.location.eventDetail.description ? currentMessage.location.eventDetail.description : null,
        alarms : currentMessage.location.eventDetail.alarms ? currentMessage.location.eventDetail.alarms : null,
        attendees : currentMessage.location.eventDetail.attendees ? currentMessage.location.eventDetail.attendees : null,
        notes : currentMessage.location.eventDetail.notes ? currentMessage.location.eventDetail.notes : null
      } 
      AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(
        (eventInfo: {
          calendarItemIdentifier: string,
          eventIdentifier: string
        }) => {
          if (
            Platform.OS === 'android' &&
            eventInfo.action === 'SAVED' &&
            eventInfo.eventIdentifier
          ) {
            console.log(eventInfo)
          }
            else if (
              Platform.OS === 'android' &&
              eventInfo.action === 'CANCELLED'
            ) {
              alert(
                'this event is already exist in this device'
              );
            }
          
        });
    }
    else {
      Linking.openURL(URL);
    }
  }
  render() {
    const {
      containerStyle,
      locationProps,
      locationStyle,
      currentMessage
    } = this.props;

    let URL = GoogleAddressing.getGoogleAddress(
      currentMessage.location.lat,
      currentMessage.location.lng
    );
    const eventDetail = {
      eventId: currentMessage.location.event
    };
    let isEvent =
      currentMessage.location && currentMessage.location.event ? true : false;
    const Location =
      currentMessage.location && currentMessage.location.location
        ? currentMessage.location.location
        : currentMessage.location;
    if (!!currentMessage) {
      return (
        <View style={[styles.container, containerStyle]}>
          <TouchableOpacity
            onPress={() => this.openMessage(isEvent,URL)}
          >
            <View
              style={{
                width: 200
              }}
            >
              <Image
                {...locationProps}
                style={[
                  isEvent ? styles.calendarImage : styles.image,
                  locationStyle
                ]}
                source={{
                  uri: isEvent
                    ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXMWPjbCP0BtZYbYPoDj07YGZ9ZetWFdNK_EI5_XgDEmVL3-IU&s'
                    : 'https://cdn.pixabay.com/photo/2016/11/04/14/13/google-maps-1797882_1280.png'
                }}
              />
              <Text
                style={{
                  margin: 3,
                  flexWrap: 'wrap',
                  color: '#dbd5d5',
                  fontSize: 18
                }}
              >
                {isEvent ? 'Calendar Invite' : `${currentMessage.location}`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
}
MessageLocation.defaultProps = {
  currentMessage: {
    location: null
  },
  containerStyle: {},
  locationStyle: {},
  locationProps: {},
  lightboxProps: {}
};
MessageLocation.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  locationStyle: PropTypes.object,
  locationProps: PropTypes.object,
  lightboxProps: PropTypes.object
};
//# sourceMappingURL=MessageLocation.js.map
