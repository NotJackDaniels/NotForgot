/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {LoginScreen} from './screens/LoginScreen';
import {RegistrationScreen} from './screens/RegistrationScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackNavigator} from './navigators/AuthStackNavigator';

const RootStack = createStackNavigator();


export default function() {
  return(
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown:false,}}>
        <RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  ); 
}
