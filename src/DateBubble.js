import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native';

const DateBubble = (props) => {
    if (!props.date) return null

    return (
        <View style={styles.container}>
            <View style={styles.wrapperStyle}>
                <Text style={styles.text}>
                    {props.date}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width,
        position: 'absolute',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    wrapperStyle: {
        backgroundColor: '#95c7eeff',
        padding: 5,
        borderRadius: 5
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',

    },
})

export default DateBubble