/* eslint-disable prettier/prettier */

import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'



export default class authLoadingScreen extends Component {

    constructor() {
        super();
        this.checkToken();
    }


    checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token){
            this.props.navigation.navigate('MainPage');
        }
        else {
            this.props.navigation.navigate('Login');
        }
    }
    render() {
        return (
            <View>
                <Text></Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
