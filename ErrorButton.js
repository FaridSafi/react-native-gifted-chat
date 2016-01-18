import React, {View, Text, TouchableHighlight} from 'react-native';
import GiftedSpinner from 'react-native-gifted-spinner';

export default class ErrorButton extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  onPress() {

    this.setState({
      isLoading: true,
    });

    this.props.onErrorButtonPress(this.props.rowData, this.props.rowID);
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={[this.props.styles.errorButtonContainer, {
          backgroundColor: 'transparent',
          borderRadius: 0,
        }]}>
          <GiftedSpinner />
        </View>
      );
    }
    return (
      <View style={this.props.styles.errorButtonContainer}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this.onPress.bind(this)}
        >
          <Text style={this.props.styles.errorButton}>↻</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

ErrorButton.defaultProps = {
  onErrorButtonPress: () => {},
  rowData: {},
  rowID: null,
  styles: {},
};