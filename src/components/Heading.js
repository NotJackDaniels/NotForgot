/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {StyleSheet} from 'react-native'
import { Text } from 'react-native';

export function Heading({children,style,...props}) {
    return (<Text {...props} style={[styles.text,style]}> {children} </Text>);
}

const styles = StyleSheet.create({
    text:{
      fontSize:24,
    },
  });