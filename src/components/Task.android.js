/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import { PRIMARYANDROID } from '../globalStyles/colors';

export class Task extends Component {
    constructor(){
        super()
        this.state ={
            checked:false,
        }

    }

    changeValue(){
        this.setState({
            checked:!this.state.checked,
        })
    }
    render() {
        return (
            <View style={{width:'100%',height:50,flexDirection: 'row'}}>
                <View style={{height:'100%',width:5,backgroundColor:'red'}}></View>
                <View style={{marginLeft:10}}>
                    <Text style={{fontSize:18,color:'black'}}>hhh</Text>
                    <Text style={{fontSize:16}}> Нежно и аккуратно</Text>
                </View>
                <View style={{position:'absolute',right:0,alignSelf:"center",marginRight:10}} >
                    <CheckBox
                        tintColors={{true:PRIMARYANDROID}}
                        value={this.state.checked}
                        onChange={()=>this.changeValue()}
                        />
                </View>
            </View>
        )
    }
}


