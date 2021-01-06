/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import { FilledButton } from '../components/FilledButton';
import {Heading} from '../components/Heading';
import { Input } from '../components/Input';
import { TextButton } from '../components/TextButton';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors';



export class LoginScreen extends React.Component{

  state = {
    email:"",
    password:""
  }

  onChangeHandle(state,value){
      this.setState({
        [state]: value
      })
  }

  doLogin() {
    const { email,password } = this.state;
    
    const req = {
      "email":email,
      "password":password
    }
    axios.post("http://practice.mobile.kreosoft.ru/public/api/login", req)
      .then(
        res => {

          AsyncStorage.setItem("token",res.data.api_token)
            .then(
              res => {
                this.props.navigation.navigate('MainPage');
              }
            );
        },
        err => {alert("email or password incorrect")}
      )
  }
  render(){
    const {email,password} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.bg}>
          <Heading style={styles.title} > Вход </Heading>
          <Input 
            style={styles.input} 
            keyboardType={'email-address'}
            value={email}
            placeholder={'YourEmail'} 
            onChangeText={(value) => this.onChangeHandle('email',value)}

          />
          <Input 
            style={styles.input} 
            secureTextEntry 
            placeholder={'Password'}
            value={password}
            onChangeText={(value) => this.onChangeHandle('password',value)}
          />
          <FilledButton title={'Вход'} style={styles.loginButton} onPress={() => {
            this.doLogin();}} />
          <TextButton title={'Регистрация'} onPress={() => {
            this.props.navigation.navigate('Registration')
          }} />
        </View>
        
      </View>
    );
  }
  
}
const styles = StyleSheet.create({
  bg:{
    backgroundColor:'white',
    width:'100%',
    padding:20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius:3,
  },
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:20,
    backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
    
  },
  input:{
    marginVertical:8,
  },
  title:{
      color:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
  },
  loginButton:{
    marginVertical:10,
  },
});