/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View,ImageBackground,Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

var logo = require('../images/logo.png');
var bg = require('../images/splashImg.png');

const clearAsyncStorage = async() => {
    AsyncStorage.clear();
}

export default class Splash extends Component {
    constructor(props)
    {
        super(props);
        setTimeout(() => {
            this.props.navigation.navigate('Auth')
        }, 2000);
    }
    
    render() {
        return (
                
                <ImageBackground
                    source={bg}
                    style={{height:'100%',width:'100%'}}
                >
                    <View
                        style={{flex:1,justifyContent:'center',alignItems:'center'}}
                    >
                        <Image
                            source={logo}
                            style={{width:'100%'}}
                        ></Image>  
                    </View>
                </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({})
