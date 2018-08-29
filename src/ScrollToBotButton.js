import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Color from './Color';

const ScrollToBotButton = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.tapContainer}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon} >Go</Text>
                </View>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.backgroundTransparent,
        width: 50,
        height: 50,
        position: 'absolute',
        right: 0,
        bottom: 10,
    },
    tapContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#95c7eeff',
        width: 20,
        height: 30,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        textAlign: 'center',
        color: 'white',
        width: 20,
        height: 20,
        fontSize: 16,
    }
})

export default ScrollToBotButton
