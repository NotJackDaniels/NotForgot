/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackNavigator} from './navigators/routes';

const RootStack = createStackNavigator();


export default function() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown:false,}}>
        <RootStack.Screen name={'AuthStack'} component={AuthStackNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  ); 
}
