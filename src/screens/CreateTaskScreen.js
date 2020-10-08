/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import {Picker} from '@react-native-community/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { BackButton } from '../components/BackButton';
import { Input } from '../components/Input';
import moment from 'moment';
import { PlusButton } from '../components/PlusButton';
import { CategoryButton } from '../components/CategoryButton'
import { FilledButton } from '../components/FilledButton';

export default class CreateTaskScreen extends Component {

    constructor(){
        super();
        this.state = {
            isVisible: false,
            priority:'Приоритет',
            date:"Сделать до",
        }
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
        category:'',
        
    }
    handlePicker = (datetime) => {
        this.setState({
            isVisible:false,
            date : moment(datetime).format('MMMM,Do YYYY'),
        })
    }


    onChangeHandle(state,value){
        this.setState({
          [state]: value
        })
    }

    

    render() {
        const {title,description,priority,category} = this.state;
        
        return (
            <View style={styles.holeContent}>
                <View  style={styles.heading}>
                    <BackButton arrow={'<'} title={'Not forgot!'} style={styles.loginButton} onPress={() => {}}/>
                    <Text style={styles.textLoc}> Добавить заметку</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.form}>
                        <Input 
                            style={{marginBottom:8,}} 
                            placeholder={'Название'}
                            value={title}
                            onChangeText={(value) => this.onChangeHandle('title',value)}
                        />
                        <View style={{backgroundColor:'rgba(51, 51, 51, 0.06)', marginBottom:5}}>
                            <Text style={{marginVertical:5,marginHorizontal:12,color:'rgba(0, 0, 0, 0.54)'}}>Описание</Text>
                            <Input 
                                style={styles.input} 
                                multiline
                                numberOfLines={3}
                                value={description}
                                onChangeText={(value) => this.onChangeHandle('description',value)}
                            /> 
                        </View>
                        <View style={{width:'100%'}}>
                            <View style={{borderRadius:10,marginBottom:5,width:'80%',backgroundColor:'rgba(116, 116, 128, 0.08)',}}>
                                <Picker
                                    selectedValue={category}
                                    itemStyle={styles.itemStyle}
                                    style={styles.priority}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.onChangeHandle('category',itemValue)
                                    }>
                                    <Picker.Item label="Категория" value="low" />
                                </Picker>
                            </View>
                            <CategoryButton title={'+'} style={styles.plusButton} onPress={() => {}} />
                        </View>
                        <View style={{borderRadius:10,marginBottom:5,width:'100%',backgroundColor:'rgba(116, 116, 128, 0.08)',}}>
                            <Picker
                                selectedValue={priority}
                                itemStyle={styles.itemStyle}
                                style={styles.priority}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.onChangeHandle('priority',itemValue)
                                }>
                                <Picker.Item label="Приоритет" value="low" />
                                <Picker.Item label="Средний" value="middle" />
                                <Picker.Item label="Высокий" value="high" />
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.picker} onPress={this.showPicker}>
                            <Text style={{color:'rgba(60, 60, 67, 0.3)'}} >{this.state.date}</Text>
                        </TouchableOpacity>
                        
                        <DateTimePicker
                            isVisible={this.state.isVisible}
                            mode="date"
                            onConfirm={this.handlePicker}
                            onCancel={this.hidePicker}
                            
                        />
                    </View>
                    <View style={styles.saveButton}>
                        <FilledButton title={'Сохранить'}  onPress={() => {}} />
                    </View>
                    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    saveButton:{
        position:'absolute',
        bottom:0,
        width:'100%',
        padding:10
    },
    holeContent:{
        flex:1,
    },
    input:{
        backgroundColor:'transparent',
        borderColor: "#fd9400",
        textAlignVertical: 'top',
        borderBottomWidth: 2,
    },
    form:{
        margin:10,
        padding:10,
        backgroundColor:'white',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
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
        backgroundColor:'rgba(116, 116, 128, 0.08)',
        color:'white',
        borderRadius:10,
        width:'100%',
        alignItems:'center',
        padding:15,
    },
    priority:{
        width: '100%',
        color:'rgba(60, 60, 67, 0.3)',
        backgroundColor:'transparent',
        alignSelf: 'stretch', 
        alignItems:'center', 
        justifyContent:'center',
    },
    itemStyle:{
        alignSelf:'center',
    }
})