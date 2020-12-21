/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, Button,KeyboardAvoidingView, ProgressViewIOS,Dimensions  } from 'react-native'
import Modal from 'react-native-modalbox'
import { PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors';
import { FilledButton } from './FilledButton';
import { Input } from './Input';
import { ModalButton } from './ModalButton';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';



const { height } = Dimensions.get('window')
const keyboardVerticalOffset = 0;


export default class CategoryModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            value:'',
            name:''
        }
    }
    showCategoryModal = () => {
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

    makeCategory = async() => {
        const { name } = this.state;
        const req = {
          "name": name,
        }
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')}
        })
        authAxios.post('/categories',req)
          .then(
            res => {
                this.props.getCategory()
                this.refs.myModal.close();
            },
          )
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

                
                    <Text style={{color:'black'}}> Добавить категорию </Text>
                    <Input 
                        style={styles.input} 
                        placeholder={'Input text'}
                        placeholderTextColor="#000" 
                        value={name}
                        maxLength = {140}
                        onChangeText={(value) => this.onChangeHandle('name',value)}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end',marginBottom:10}}>
                        <Text>{name.length}/140</Text>
                    </View>
                    <View style={{width:'100%',  flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <ModalButton title='Отмена' style={styles.buttons} onPress={()=>{this.closeModal()}}/>
                        <ModalButton title={'Сохранить'} style={styles.buttons} onPress={() => {
                            this.makeCategory()}}/>
                    </View>

                  
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        borderColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        color:'black',
        borderBottomWidth:2,
        marginBottom:10,
        paddingHorizontal:0,
        marginHorizontal:5,
        
    },
    buttons:{
        color:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        backgroundColor:'white',
        marginHorizontal:5
    },
    modal:{
        justifyContent:'center',
        width:'80%',
        height:170,
        padding:10,
        marginVertical:'20%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    }
})