/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, Button,KeyboardAvoidingView, ProgressViewIOS  } from 'react-native'
import Modal from 'react-native-modalbox'
import { GreyBg, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors';
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

    onChangeHandle(state,value){
        this.setState({
            [state]: value
        })
    }

    render() {
        const {name} = this.state;
        return (
                <Modal 
                ref={"myModal"}
                style={{
                    justifyContent:'center',
                    borderRadius:10,
                    width:'80%',
                    height:100,
                    marginVertical:'20%',
                    alignItems:'center',
                    backgroundColor:' rgba(242, 242, 242, 0.8)',
                }}
                position='top'
                backdrop={true}
                onClosed={()=>{}}
                >

                    <View style={{padding:10,alignItems:'center',width:'100%'}}>
                        <Text style={{color:'black',fontSize:18,fontWeight:'900'}}> Сохранить? </Text>
                        <Text style={{color:'black',fontSize:14,fontWeight:'normal',paddingHorizontal:30,textAlign:'center'}}> Сохранить изменения? </Text>

                    </View>
                    <View style={{height:1,backgroundColor:GreyBg,width:'100%'}}></View>
                    <View style={{width:'100%',  flexDirection: 'row',}}>
                        <ModalButton title='Отмена' style1={styles.buttons} onPress={()=>{this.props.goBack()}}/>
                        <View style={{height:'100%',backgroundColor:GreyBg,width:1}}></View>
                        <ModalButton title={'Сохранить'} style1={styles.buttons}  onPress={() => {
                            this.props.saveAll()}}/>
                    </View>

                  
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        marginVertical:10,
        paddingVertical:0,
        marginHorizontal:5,
        borderRadius:5,
        paddingHorizontal:5,
        borderWidth:0,
    },
    buttons:{
        color:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        backgroundColor:'transparent',
        marginHorizontal:0,
        width:'50%',
    }
})
