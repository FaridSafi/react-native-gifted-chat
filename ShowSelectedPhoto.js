var React = require('react-native');

var Button = require('react-native-button');

var {
  Text,
  View,
  Dimensions,
  Image,
} = React;

var {height, width} = Dimensions.get('window');
let ShowSelectedPhoto = React.createClass({
  componentWillMount() {
    this.styles = {
      imageToSend : {
           width: width * .8,
           height: height * .8,
           resizeMode : "contain",
           borderRadius : 8,
           flex: 4,
      },
      sendButtonImage: {
        height: 120,
        marginTop: 10,
        marginRight: 10,
        flex: 1
      },
      cancelButtonImage: {
        height: 120,
        marginTop: 10,
        marginLeft: 10,
        flex: 1
      },
      photoInputContainer:{
        flex: 1,
        height: height,
        flexDirection: 'row',

      }
     
    }
       Object.assign(this.styles, this.props.styles);
  },  
  render() {
    let ShowSelectedPhoto;
    let photoUri;

    //if(this.props.imagePicked){
      photoUri = this.props.photo
    //}

    return(

        <View style={this.props.style}>  
           <Button
              style={this.styles.cancelButtonImage}
              styleDisabled={this.styles.sendButtonDisabled}
              onPress={this.props.cancel}
       
            >Cancel </Button>
            <Image  style={this.styles.imageToSend} source={{uri: photoUri}} />
            <Button
              style={this.styles.sendButtonImage}
              styleDisabled={this.styles.sendButtonDisabled}
              onPress={this.props.onSend}
            
            > {this.props.sendButtonText} </Button>  
        </View>
          

    );
  }
});

module.exports = ShowSelectedPhoto;