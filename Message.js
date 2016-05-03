import React, { View, Text, StyleSheet, TouchableHighlight, Image, Component } from 'react-native';
import Bubble from './Bubble';
import ErrorButton from './ErrorButton';

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  name: {
    color: '#aaaaaa',
    fontSize: 12,
    marginLeft: 55,
    marginBottom: 5,
  },
  nameInsideBubble: {
    color: '#666666',
    marginLeft: 0,
  },
  imagePosition: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    marginLeft: 8,
    marginRight: 8,
  },
  image: {
    alignSelf: 'center',
    borderRadius: 15,
  },
  imageLeft: {
  },
  imageRight: {
  },
  spacer: {
    width: 10,
  },
  status: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'right',
    marginRight: 15,
    marginBottom: 10,
    marginTop: -5,
  },
  initialContainerStyle: {
    backgroundColor: 'rgb(1, 43, 219)',
    borderRadius: 15,
    width: 30,
    height: 30,
    paddingTop: 7,
    marginHorizontal: 3,
    marginTop: 2,
  },
  initialsStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: 'transparent',
  }
});

export default class Message extends Component {

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }
  componentWillReceiveProps() {
    Object.assign(styles, this.props.styles);
  }

  renderName(name, displayNames, diffMessage){
    if (displayNames === true) {
      if (diffMessage === null || name !== diffMessage.name) {
        return (
          <Text
            style={[
              styles.name,
              this.props.displayNamesInsideBubble ? styles.nameInsideBubble : null,
            ]}
          >
            {name}
          </Text>
        );
      }
    }
    return null;
  }

  renderImage(rowData, diffMessage, forceRenderImage, onImagePress, useInitials=false) {
    const ImageView = rowData.imageView || Image;
    let shouldUseInitials = useInitials && (rowData.name || rowData.initials);

    if (rowData.image || shouldUseInitials) {
      if (forceRenderImage) {
        diffMessage = null; // force rendering
      }

      if (diffMessage === null || (diffMessage !== null && (rowData.name !== diffMessage.name || rowData.uniqueId !== diffMessage.uniqueId))) {
        if (typeof onImagePress === 'function') {
          return (
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => onImagePress(rowData)}
            >
              {shouldUseInitials
                ? <View style={styles.initialContainerStyle}>
                    <Text style={styles.initialsStyle}>{this.getInitials(rowData)}</Text>
                  </View>
                : <ImageView
                    source={rowData.image}
                    style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}
                  />
              }
            </TouchableHighlight>
          );
        }
        return (
          shouldUseInitials
            ? <View style={styles.initialContainerStyle}>
                <Text style={styles.initialsStyle}>{this.getInitials(rowData)}</Text>
              </View>
            : <ImageView
                source={rowData.image}
                style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}
              />
        );
      }
      return (
        <View style={styles.imagePosition} />
      );
    }
    return (
      <View style={styles.spacer} />
    );
  }

  getInitials({initials, name}) {
    if(initials) return initials;
    else if(name) {
      let parts = name.split(' ');
      let first = parts[0];
      let last = parts[parts.length-1];
      initials = first[0] + (last !== first ? last[0] : '');
      return initials.toUpperCase();
    }
    else return '?';
  }

  renderErrorButton(rowData, onErrorButtonPress) {
    if (rowData.status === 'ErrorButton') {
      return (
        <ErrorButton
          onErrorButtonPress={onErrorButtonPress}
          rowData={rowData}
          styles={styles}
        />
      );
    }
    return null;
  }

  renderStatus(status) {
    if (status !== 'ErrorButton' && typeof status === 'string') {
      if (status.length > 0) {
        return (
          <View>
            <Text style={styles.status}>{status}</Text>
          </View>
        );
      }
    }
    return null;
  }

  render() {
    var {
      rowData,
      onErrorButtonPress,
      position,
      displayNames,
      diffMessage,
      forceRenderImage,
      onImagePress,
      onMessageLongPress,
      useInitials,
    } = this.props;

    const flexStyle = {};
    let RowView = Bubble;
    if (rowData.text) {
      if (rowData.text.length > 40) {
        flexStyle.flex = 1;
      }
    }

    if (rowData.view) {
      RowView = rowData.view;
    }

    let messageView = (
      <View>
        {position === 'left' && !this.props.displayNamesInsideBubble ? this.renderName(rowData.name, displayNames, diffMessage) : null}
        <View
          style={[styles.rowContainer, {
            justifyContent: position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center',
          }]}
        >
          {position === 'left' ? this.renderImage(rowData, diffMessage, forceRenderImage, onImagePress) : null}
          {position === 'right' ? this.renderErrorButton(rowData, onErrorButtonPress) : null}
          <RowView
            {...rowData}
            renderCustomText={this.props.renderCustomText}
            styles={styles}
            name={position === 'left' && this.props.displayNamesInsideBubble ? this.renderName(rowData.name, displayNames, diffMessage) : null}

            parseText={this.props.parseText}
            handlePhonePress={this.props.handlePhonePress}
            handleUrlPress={this.props.handleUrlPress}
            handleEmailPress={this.props.handleEmailPress}
          />
          {rowData.position === 'right' ? this.renderImage(rowData, diffMessage, forceRenderImage, onImagePress, useInitials) : null}
        </View>
        {rowData.position === 'right' ? this.renderStatus(rowData.status) : null}
      </View>
    );

    if (typeof onMessageLongPress === 'function') {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onLongPress={() => onMessageLongPress(rowData)}
        >
          {messageView}
        </TouchableHighlight>
      );
    }
    return messageView;
  }
}
