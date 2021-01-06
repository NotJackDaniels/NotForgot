/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet,TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';

export function TextButton({title,style,onPress}) {

    return (
        <Ripple style={[styles.container,style]} onPress={onPress}>
            <Text style={styles.text}>{title.toUpperCase()}</Text>
        </Ripple>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'grey',
        color:'white',
        borderRadius:2,
        width:'100%',
        alignItems:'center',
        padding:15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 3,
    },
    text:{
        color:'white',
        fontWeight:'500',
        fontSize:18,
    }
})