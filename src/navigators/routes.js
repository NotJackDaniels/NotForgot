/* eslint-disable prettier/prettier */

import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegistrationScreen } from '../screens/RegistrationScreen';
import MainScreen from '../screens/MainScreen';
import authLoadingScreen from '../screens/authLoadingScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';


const RoutStack = createStackNavigator();

export function AuthStackNavigator() {
    return (
        <RoutStack.Navigator screenOptions={{headerShown:false,}}>
            <RoutStack.Screen name={'Auth'} component={authLoadingScreen}/>
            <RoutStack.Screen name={'Login'} component={LoginScreen}/>
            <RoutStack.Screen name={'Registration'} component={RegistrationScreen}/>
            <RoutStack.Screen name={'MainPage'} component={MainScreen}/>
            <RoutStack.Screen name={'CreateTask'} component={CreateTaskScreen}/>
        </RoutStack.Navigator>
    ); 
}




