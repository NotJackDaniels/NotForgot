/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, Button,KeyboardAvoidingView, ProgressViewIOS  } from 'react-native'
import Modal from 'react-native-modalbox'
import { PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors';
import { FilledButton } from './FilledButton';
import { Input } from './Input';
import { ModalButton } from './ModalButton';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';




const keyboardVerticalOffset = 0;


export default class SaveModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            value:'',
            name:''
        }
    }
    showSaveModal = () => {
        this.refs.myModal.open();
    }

    closeModal = () => {
        this.refs.myModal.close()
    }

    render() {
        const {name} = this.state;
        return (
                <Modal 
                ref={"myModal"}
                style={styles.modal}
                position='top'
                backdrop={true}
                onClosed={()=>{}}
                >
                    <Text style={{marginBottom:30}}>Сохранить?</Text>
                    <View style={{width:'100%',  flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <ModalButton title='Отмена' style={styles.buttons} onPress={()=>{this.props.goBack()}}/>
                        <ModalButton title={'Да!'} onPress={() => {this.props.saveAll()}}/>
                    </View>

                  
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    buttons:{
        color:'rgba(0, 0, 0, 0.38)',
    },
    modal:{
        width:'80%',
        height:115,
        padding:20,
        marginVertical:'20%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    }
})