/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet,TouchableOpacity, } from 'react-native'

export function PlusButton({title,style,onPress}) {

    return (
        <TouchableOpacity style={[styles.container,style]} onPress={onPress}>
            <Text style={styles.text}>{title.toUpperCase()}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fd9400',
        color:'white',
        borderRadius:10,
        width:50,
        alignItems:'center',
        padding:5,
    },
    text:{
        color:'white',
        fontWeight:'100',
        fontSize:30,
    }
})
