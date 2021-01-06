/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View,ImageBackground,Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modalbox'
var logo = require('../images/logo.png');
var bg = require('../images/splashImg.png');

export default class Lottie extends Component {
    constructor(props)
    {
        super(props);
    }
    showLottieModal = () => {
        this.refs.lottie.open();
    }

    closeLottieModal = () => {
        this.refs.lottie.close();
    }

    
    render() {
        return (
            <Modal 
                ref={"lottie"}
                style={styles.modal}
                position='center'
                backdrop={true}
                onClosed={()=>{this.closeLottieModal()}}
                >
                    <LottieView source={require('../assets/3150-success.json')} autoPlay loop />
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent'
    }
})