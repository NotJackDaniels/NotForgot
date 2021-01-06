/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackNavigator} from './navigators/routes';
import { StatusBar } from 'react-native';
import { PRIMARYANDROID } from './globalStyles/colors';

const RootStack = createStackNavigator();


export default function() {
  return (
    <>
      <StatusBar backgroundColor={'#c66a37'} />
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown:false,}}>
          <RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  ); 
}
