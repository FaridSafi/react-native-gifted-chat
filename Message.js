import React, {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native';
import Bubble from './Bubble';
import ErrorButton from './ErrorButton';

var styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  name: {
    color: '#aaaaaa',
    fontSize: 12,
    marginLeft: 20,
    marginBottom: 5,
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
  errorButtonContainer: {
    marginLeft: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6eb',
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  errorButton: {
    fontSize: 22,
    textAlign: 'center',
  },
  status: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'right',
    marginRight: 15,
    marginBottom: 10,
    marginTop: -5,
  },
});

export default class Message extends React.Component {

  constructor(props) {
    super(props);
  }

  renderName(name, displayNames, diffMessage){
    if (displayNames === true) {
      if (diffMessage === null || name !== diffMessage.name) {
        return (
          <Text style={[styles.name]}>
            {name}
          </Text>
        );
      }
    }
    return null;
  }

  renderImage(rowData, rowID, diffMessage, forceRenderImage, onImagePress){
    if (rowData.image !== null) {
      if (forceRenderImage === true) {
        diffMessage = null; // force rendering
      }

      if (diffMessage === null || (rowData.name !== diffMessage.name || rowData.id !== diffMessage.id)) {
        if (typeof onImagePress === 'function') {
          return (
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => onImagePress(rowData, rowID)}
              style={styles.imagePosition}
            >
              <Image source={rowData.image} style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
            </TouchableHighlight>
          );
        } else {
          return (
            <Image source={rowData.image} style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
          );
        }
      } else {
        return (
          <View style={styles.imagePosition}/>
        );
      }
    }
    return (
      <View style={styles.spacer}/>
    );
  }

  renderErrorButton(rowData, rowID, onErrorButtonPress){
    if (rowData.status === 'ErrorButton') {
      return (
        <ErrorButton
          onErrorButtonPress={onErrorButtonPress}
          rowData={rowData}
          rowID={rowID}
          styles={{
            errorButtonContainer: styles.errorButtonContainer,
            errorButton: styles.errorButton,
          }}
        />
      )
    }
    return null;
  }

  renderStatus(status){
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

  render(){

    var {
      rowData,
      rowID,
      onErrorButtonPress,
      position,
      displayNames,
      diffMessage,
      forceRenderImage,
      onImagePress
    } = this.props;

    var flexStyle = {};
    if ( rowData.text.length > 40 ) {
     flexStyle.flex = 1;
    }

    return (
      <View>
      {position === 'left' ? this.renderName(rowData.name, displayNames, diffMessage) : null}
      <View style={[styles.rowContainer, {
          justifyContent: position==='left'?"flex-start":"flex-end"
        }]}>
        {position === 'left' ? this.renderImage(rowData, rowID, diffMessage, forceRenderImage, onImagePress) : null}
        {position === 'right' ? this.renderErrorButton(rowData, rowID, onErrorButtonPress) : null}
        <Bubble
          position={rowData.position}
          status={rowData.status}
          text={rowData.text}
          renderCustomText={this.props.renderCustomText}
          />
        {rowData.position === 'right' ? this.renderImage(rowData, rowID) : null}
      </View>
      {rowData.position === 'right' ? this.renderStatus(rowData, rowID) : null}
      </View>
    )
  }
}
