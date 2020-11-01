/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform } from 'react-native'
import { PlusButton } from '../components/PlusButton'
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors'

export default class MainScreen extends Component {
    render() {
        return (
            <View  style={styles.heading}>
                <Text style={styles.textLoc}> Not forgot! </Text>
                <PlusButton title={'+'} style={styles.plusButton} onPress={() => {
                    this.props.navigation.navigate('CreateTask')}} />
                    <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="me-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
            <Icon name="me-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    heading:{
        height:'22%',
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        justifyContent: 'center',
    },
    textLoc:{
        position: 'absolute',
        bottom:0,
        padding:5,
        color:'white',
        fontSize:30,
        fontWeight:'bold',
    },
    plusButton:{
        position: 'absolute',
        right:0,
    }
})
