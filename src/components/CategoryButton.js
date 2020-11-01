/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet,TouchableOpacity, Platform } from 'react-native'
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS, SECONDARY } from '../globalStyles/colors'

export function CategoryButton({title,style,onPress}) {

    return (
        <TouchableOpacity style={[styles.container,style]} onPress={onPress}>
            <Text style={styles.text}>{title.toUpperCase()}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:SECONDARY,
        color:SECONDARY,
        borderRadius:10,
        width:50,
        alignItems:'center',
    },
    text:{
        color:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        fontWeight:'100',
        fontSize:35,
    }
})