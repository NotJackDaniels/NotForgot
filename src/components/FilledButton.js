/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet,TouchableOpacity, Platform } from 'react-native'
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors';

export function FilledButton({title,style,onPress}) {

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
