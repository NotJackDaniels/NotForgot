/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { FilledButton } from '../components/FilledButton';
import {Heading} from '../components/Heading';
import { Input } from '../components/Input';
import { TextButton } from '../components/TextButton';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';



export class RegistrationScreen extends React.Component {

  state = {
    email:'',
    name:'',
    password:'',
    repeatPassword:'',
  }

  onChangeHandle(state,value){
      this.setState({
        [state]: value
      })
  }
  doRegister(){
    const { email,name,password,repeatPassword } = this.state;
    if(this.state.password !== this.state.repeatPassword){
      alert("Пароли не совпадают");
    }
    else if(this.state.password === "" || this.state.repeatPassword || this.state.email || this.state.name){
      alert("Остались незаполненные поля");
    }
    else{

      const req = {
        "email":email,
        "name":name,
        "password":password
      }
      axios.post("http://practice.mobile.kreosoft.ru/public/api/register", req)
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
  }
    
  

  render(){
    const {email,name,password,repeatPassword} = this.state;
    return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <Heading style={styles.title} > Регистрация </Heading>
        <Input style={styles.input} placeholder={'YourName'}
          value={name}
          onChangeText={(value) => this.onChangeHandle('name',value)}
        />
        <Input style={styles.input} keyboardType={'email-address'} placeholder={'YourEmail'} 
          value={email}
          onChangeText={(value) => this.onChangeHandle('email',value)}
        />
        <Input style={styles.input} secureTextEntry placeholder={'Password'} 
          value={password}
          onChangeText={(value) => this.onChangeHandle('password',value)}
        />
        <Input style={styles.input} secureTextEntry placeholder={'Repeat Password'} 
          value={repeatPassword}
          onChangeText={(value) => this.onChangeHandle('repeatPassword',value)}
        />

        <FilledButton title={'Зарегестрироваться'} style={styles.loginButton} onPress={() =>{
          this.doRegister();
        }} />
        <TextButton title={'Войти'} onPress={() => {
          this.props.navigation.navigate('Login');
        }} />
      </View>
      
    </View>
  );}
  
}
const styles = StyleSheet.create({
  bg:{
    backgroundColor:'white',
    width:'100%',
    padding:20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:20,
    backgroundColor:'#fd9400',
  },
  input:{
    marginVertical:8,
  },
  title:{
      color:'#fd9400',
  },
  loginButton:{
    marginVertical:10,
  },
});