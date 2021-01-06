/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet,TouchableOpacity, Platform } from 'react-native'
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors';

export function PlusButton({title,style,onPress}) {

    return (
        <TouchableOpacity style={[styles.container,style]} onPress={onPress}>
            <Text style={styles.text}>{title.toUpperCase()}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
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
