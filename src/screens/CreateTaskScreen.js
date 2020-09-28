/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { BackButton } from '../components/BackButton';
import { Input } from '../components/Input';

export default class CreateTaskScreen extends Component {

    constructor(){
        super();
        this.state = {
            isVisible: false,
        }
    }

    handlePicker = () => {
        this.setState({
            isVisible:false
        })
    }

    hidePicker = () => {
        this.setState({
            isVisible:false
        })
    }

    showPicker = () => {
        this.setState({
            isVisible:true
        })
    }

    state = {
        title:'',
        description:'',
    }

    onChangeHandle(state,value){
        this.setState({
          [state]: value
        })
    }

    render() {
        const {title,description} = this.state;
        return (
            <View style={styles.holeContent}>
                <View  style={styles.heading}>
                    <BackButton arrow={'<'} title={'Not forgot!'} style={styles.loginButton} onPress={() => {}}/>
                    <Text style={styles.textLoc}> Добавить заметку</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.form}>
                        <Input 
                            style={{marginVertical:8,}} 
                            placeholder={'Название'}
                            value={title}
                            onChangeText={(value) => this.onChangeHandle('title',value)}
                        />
                        <View style={{backgroundColor:'rgba(51, 51, 51, 0.06)'}}>
                            <Text style={{marginVertical:5,marginHorizontal:12,color:'rgba(0, 0, 0, 0.54)'}}>Описание</Text>
                            <Input 
                                style={styles.input} 
                                multiline
                                numberOfLines={4}
                                value={description}
                                onChangeText={(value) => this.onChangeHandle('description',value)}
                            />
                            
                        </View>
                        <TouchableOpacity style={styles.picker} onPress={this.showPicker}>
                            <Text style={{color:'rgba(60, 60, 67, 0.3)'}} >сделать до</Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.isVisible}
                            mode="date"
                            onConfirm={this.handlePicker}
                            onCancel={this.hidePicker}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    holeContent:{
        flex:1,
    },
    input:{
        backgroundColor:'transparent',
        borderColor: "#fd9400",
        textAlignVertical: 'top',
    },
    form:{
        margin:10,
        padding:10,
        backgroundColor:'white',
    },
    heading:{
        flex:0.15,
        backgroundColor:'#fd9400',
        justifyContent: 'center',
        padding:5,
    },
    textLoc:{
        position: 'absolute',
        bottom:0,
        color:'white',
        fontSize:20,
        fontWeight:'bold',
        padding:5,
    },
    plusButton:{
        position: 'absolute',
        right:0,
    },
    content:{
        flex:0.85,
    },
    picker:{
        backgroundColor:'grey',
        color:'white',
        borderRadius:10,
        width:'100%',
        alignItems:'center',
        padding:15,
    }
})