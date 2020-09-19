/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet,TouchableOpacity } from 'react-native';

export function TextButton({title,style,onPress}) {

    return (
        <TouchableOpacity style={[styles.container,style]} onPress={onPress}>
            <Text style={styles.text}>{title.toUpperCase()}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'grey',
        color:'white',
        borderRadius:10,
        width:'100%',
        alignItems:'center',
        padding:15,
    },
    text:{
        color:'white',
        fontWeight:'500',
        fontSize:18,
    }
})