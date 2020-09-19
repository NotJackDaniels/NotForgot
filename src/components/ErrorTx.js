/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ErrorTx({error}) {
    return (
        <View style={styles.container}>
             <Text style={styles.text}>{error}</Text>
        </View>
       
    );
}

const styles = StyleSheet.create({
    container:{
        paddingVertical:8,
    },
    text:{
        color:'red',
        fontWeight:'bold',
    },
});
