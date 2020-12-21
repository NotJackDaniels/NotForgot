/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet,TouchableOpacity, Platform } from 'react-native'
import { PRIMARYANDROID, PRIMARYIOS, SECONDARY } from '../globalStyles/colors';

export function ModalButton({title,style,style1,onPress}) {

    return (
        <TouchableOpacity style={[styles.container,style1]} onPress={onPress}>
            <Text style={[styles.text,style]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:SECONDARY,
        color:SECONDARY,
        borderRadius:10,
        alignItems:'center',
    },
    text:{
        color:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        fontWeight:'100',
        fontSize:18,
        padding:7,
    }
})