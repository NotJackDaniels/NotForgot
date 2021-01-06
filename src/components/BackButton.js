/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet,TouchableOpacity, Platform } from 'react-native'
import Ripple from 'react-native-material-ripple';
import { PRIMARYANDROID, PRIMARYIOS, SECONDARY } from '../globalStyles/colors';

export function BackButton({arrow,title,style,onPress}) {

    return (
        <Ripple style={[styles.container,style]} onPress={onPress}>
            <Text style={styles.arrow}>{arrow}</Text>
            <Text style={styles.text}>{title}</Text>
        </Ripple>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        color:SECONDARY,
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