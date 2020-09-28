/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet,TouchableOpacity, } from 'react-native'

export function BackButton({arrow,title,style,onPress}) {

    return (
        <TouchableOpacity style={[styles.container,style]} onPress={onPress}>
            <Text style={styles.arrow}>{arrow}</Text>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fd9400',
        color:'white',
        borderRadius:10,
        width:'100%',
        alignItems:'center',
        flexDirection: 'row',
        padding:5,
    },
    text:{
        color:'white',
        fontWeight:'500',
        fontSize:16,
    },
    arrow:{
        color:'white',
        fontSize:26,
    }
})