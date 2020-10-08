/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet,TouchableOpacity, } from 'react-native'

export function CategoryButton({title,style,onPress}) {

    return (
        <TouchableOpacity style={[styles.container,style]} onPress={onPress}>
            <Text style={styles.text}>{title.toUpperCase()}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        color:'white',
        borderRadius:10,
        width:50,
        alignItems:'center',
    },
    text:{
        color:'#fd9400',
        fontWeight:'100',
        fontSize:35,
    }
})