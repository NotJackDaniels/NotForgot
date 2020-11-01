/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform } from 'react-native'
import { PlusButton } from '../components/PlusButton'
import ActionButton from 'react-native-action-button';
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors'
import Icon from 'react-native-vector-icons/Ionicons';

export default class MainScreen extends Component {
    render() {
        return (
            <View style={{flex:1}}>
                <View  style={styles.heading}>
                    <Text style={styles.textLoc}> Not forgot! </Text>
                        
                </View>
                <ActionButton buttonColor={PRIMARYANDROID}
                    onPress={() => {
                        this.props.navigation.navigate('CreateTask')}}
                ></ActionButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    heading:{
        flex:0.10,
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        justifyContent: 'center',
    },
    textLoc:{
        position: 'absolute',
        padding:5,
        color:'white',
        fontSize:20,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
      },
})