/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';

export function Input({style,...props}) {
    return (<TextInput {...props} style={[style, styles.input]}/>);
}

const styles = StyleSheet.create({
    input:{
        backgroundColor:'white',
        width:'100%',
        padding:12,
        borderBottomWidth: 1,
        borderColor:'#a9a9a9',
    },
});

