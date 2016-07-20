import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableHighlight,
} from 'react-native';

export default class ListRow extends Component {
  renderRightIcon() {
    if (this.props.rightIcon) {
      return (
        <View style={styles.iconContainer}>
          {this.props.rightIcon()}
        </View>
      );
    }
    return null;
  }

  renderLeftIcon() {
    if (this.props.leftIcon) {
      return (
        <View style={styles.iconContainer}>
          {this.props.leftIcon()}
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        onPress={this.props.onPress}
      >
        <View style={styles.container}>
          {this.renderLeftIcon()}
          <View style={styles.textContainer}>
            <Text style={styles.primaryText}>
              {this.props.primaryText}
            </Text>
            <Text style={styles.secondaryText}>
              {this.props.secondaryText}
            </Text>
          </View>
          {this.renderRightIcon()}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#F8F8F8',
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    fontSize: 12,
    marginBottom: 3,
  },
  secondaryText: {
    fontSize: 11,
    color: '#8D8D8D',
  },
  iconContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#C4C4C4',
  },
});
