import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import GiftedSpinner from 'react-native-gifted-spinner';

const styles = StyleSheet.create({
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
});

export default class ErrorButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };

    this.onPress = this.onPress.bind(this);
  }

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  onPress() {
    this.setState({
      isLoading: true,
    });

    this.props.onErrorButtonPress(this.props.rowData);
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <View
          style={[styles.errorButtonContainer, {
            backgroundColor: 'transparent',
            borderRadius: 0,
          }]}
        >
          <GiftedSpinner />
        </View>
      );
    }
    return (
      <View style={styles.errorButtonContainer}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.onPress}
        >
          <Text style={styles.errorButton}>↻</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

ErrorButton.propTypes = {
  styles: React.PropTypes.object,
  onErrorButtonPress: React.PropTypes.func,
  rowData: React.PropTypes.object,
};

ErrorButton.defaultProps = {
  onErrorButtonPress: () => {},
  rowData: {},
  styles: {},
};
