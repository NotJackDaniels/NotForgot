/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { FilledButton } from '../components/FilledButton';
import {Heading} from '../components/Heading';
import { Input } from '../components/Input';
import { TextButton } from '../components/TextButton';



export function LoginScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <Heading style={styles.title} > Вход </Heading>
        <Input style={styles.input} keyboardType={'email-address'} placeholder={'YourEmail'} />
        <Input style={styles.input} secureTextEntry placeholder={'Password'} />
        <FilledButton title={'Вход'} style={styles.loginButton} onPress={() =>{}} />
        <TextButton title={'Регистрация'} onPress={() => {
          navigation.navigate('Registration');
        }} />
      </View>
      
    </View>
  );
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