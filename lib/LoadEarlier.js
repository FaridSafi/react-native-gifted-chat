import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View, ViewPropTypes, } from 'react-native';
import Color from './Color';
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.defaultColor,
        borderRadius: 15,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
    },
    text: {
        backgroundColor: Color.backgroundTransparent,
        color: Color.white,
        fontSize: 12,
    },
    activityIndicator: {
        marginTop: Platform.select({
            ios: -14,
            android: -16,
        }),
    },
});
export default class LoadEarlier extends React.Component {
    renderLoading() {
        if (this.props.isLoadingEarlier === false) {
            return (<Text style={[styles.text, this.props.textStyle]}>
          {this.props.label}
        </Text>);
        }
        return (<View>
        <Text style={[styles.text, this.props.textStyle, { opacity: 0 }]}>
          {this.props.label}
        </Text>
        <ActivityIndicator color={this.props.activityIndicatorColor} size={this.props.activityIndicatorSize} style={[styles.activityIndicator, this.props.activityIndicatorStyle]}/>
      </View>);
    }
    render() {
        return (<TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
            if (this.props.onLoadEarlier) {
                this.props.onLoadEarlier();
            }
        }} disabled={this.props.isLoadingEarlier === true} accessibilityTraits='button'>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          {this.renderLoading()}
        </View>
      </TouchableOpacity>);
    }
}
LoadEarlier.defaultProps = {
    onLoadEarlier: () => { },
    isLoadingEarlier: false,
    label: 'Load earlier messages',
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    activityIndicatorStyle: {},
    activityIndicatorColor: 'white',
    activityIndicatorSize: 'small',
};
LoadEarlier.propTypes = {
    onLoadEarlier: PropTypes.func,
    isLoadingEarlier: PropTypes.bool,
    label: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    wrapperStyle: ViewPropTypes.style,
    textStyle: PropTypes.any,
    activityIndicatorStyle: ViewPropTypes.style,
    activityIndicatorColor: PropTypes.string,
    activityIndicatorSize: PropTypes.string,
};
//# sourceMappingURL=LoadEarlier.js.map