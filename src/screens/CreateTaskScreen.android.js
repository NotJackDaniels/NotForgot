/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Platform, Image } from 'react-native';
//import {Picker} from '@react-native-community/picker';
import {Picker} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { BackButton } from '../components/BackButton';
import { Input } from '../components/Input';
import moment from 'moment';
import { PlusButton } from '../components/PlusButton';
import { CategoryButton } from '../components/CategoryButton'
import { FilledButton } from '../components/FilledButton';
import CategoryModal from '../components/CategoryModal';
import { GreyBg, PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default class CreateTaskScreen extends Component {

    constructor(){
        super();
        this.state = {
            isVisible: false,
            priority:'Приоритет',
            showDate:"Сделать до",
            date:'',
            allCategories:[],
            allPriorities:[],
            selected_id:''
        }
        this.AddCategory = this.AddCategory.bind(this);
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
        console.warn(datetime);
        this.setState({
            isVisible:false,
            showDate : moment(datetime).format('DD.MM.YYYY'),
            date:moment(datetime,"DD.MM.YYYY").unix(),
        })
    }

    getCategory = async() => {
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
           
        })
        authAxios.get('/categories')
          .then(
            res => {
                this.setState({allCategories:res.data});
            },
            err => {alert("Ошибка запроса")}
          )
    }

    getPriorities = async() => {
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
           
        })
        authAxios.get('/priorities')
          .then(
            res => {
                this.setState({allPriorities:res.data});
            },
            err => {alert("Ошибка запроса")}
          )
    }

    saveAll = async() => {
        const {title,description,priority,category} = this.state;
        console.warn(title,description,1,this.state.date,category,priority);
        const req = {
          "title": title,
          "description":description,
          "done": 1,
          "deadline":this.state.date,
          "category_id":category,
          "priority_id":priority,
        }
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')}
        })
        authAxios.post('/tasks',req)
          .then(
            res => {
                console.warn(res);
            },
          )
    }

    onChangeHandle(state,value){
        this.setState({
          [state]: value
        })
    }

    componentDidMount()
    {
        this.getCategory();
        this.getPriorities();
    }

    AddCategory(){
        this.refs.addModal.showCategoryModal();
    }

    render() {
        const {title,description,priority,category} = this.state;
        return (
            <View style={styles.holeContent}>
            
                <View  style={styles.heading}>
                    <TouchableOpacity style={{marginLeft:10,display:'flex'}} 
                        onPress={() => {this.props.navigation.navigate('MainPage')}}
                    >
                        <Image  source={require("../assets/arrow.png")}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:20,marginLeft:50}}>Not forgot!</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.note}>Добавить заметку</Text>
                    <SafeAreaView style={styles.form}>
                        <Input 
                            style={{marginBottom:8,}} 
                            placeholder={'Название'}
                            value={title}
                            onChangeText={(value) => this.onChangeHandle('title',value)}
                        />
                        <View style={{backgroundColor:'rgba(51, 51, 51, 0.06)', marginBottom:5}}>
                            <Text style={{marginTop:5,marginHorizontal:12,color:'rgba(0, 0, 0, 0.54)'}}>Описание</Text>
                            <Input 
                                style={styles.input} 
                                multiline
                                numberOfLines={3}
                                value={description}
                                onChangeText={(value) => this.onChangeHandle('description',value)}
                            /> 
                        </View>
                        <View style={{width:'100%'}}>
                            <View style={{marginBottom:5,width:'80%',backgroundColor:'rgba(116, 116, 128, 0.08)',}}>
                                <Picker
                                mode="dropdown"
                                
                                    selectedValue={category}
                                    itemStyle={styles.itemStyle}
                                    style={styles.priority}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.onChangeHandle('category',itemValue)
                                    }>
                                    {this.state.allCategories.length ?
                                        this.state.allCategories.map(category=>

                                        <Picker.Item key={category.id} label={category.name} value={category.id}/>)
                                        :
                                        <Picker.Item label="Категория" value="low" />
                                    }
                                    <Picker.Item label="Категория" value="low" />
                                </Picker>
                            </View>
                            <CategoryButton title={'+'} style={styles.plusButton} onPress={() => this.AddCategory()} />
                        </View>
                        <View style={{marginBottom:5,width:'100%',backgroundColor:'rgba(116, 116, 128, 0.08)',}}>
                            <Picker
                                mode="dropdown"
                                placeholder="Start Year"
                                selectedValue={priority}
                                itemStyle={styles.itemStyle}
                                style={styles.priority}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.onChangeHandle('priority',itemValue)
                                }>
                                {this.state.allPriorities.length ?
                                    this.state.allPriorities.map(prior=>
                                    <Picker.Item key={prior.id} label={prior.name} value={prior.id}/>
                                    ):
                                    <Picker.Item label="Ошибка" value="error" />
                                }
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.picker} onPress={this.showPicker}>
                            <Text style={{color:GreyBg}} >{this.state.showDate}</Text>
                            
                        </TouchableOpacity>
                        
                        <DateTimePicker
                            isVisible={this.state.isVisible}
                            mode="date"
                            onConfirm={this.handlePicker}
                            onCancel={this.hidePicker}
                            style={{textColor:PRIMARY}}
                            
                        />

                    </SafeAreaView>
                    
                    <View style={styles.saveButton}>
                        <FilledButton title={'Сохранить'} onPress={() => {this.saveAll()}} />
                    </View>

                </View>
                <CategoryModal ref={'addModal'} />
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
        borderColor: Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        textAlignVertical: 'top',
        borderBottomWidth: 2,
        paddingHorizontal:10,
        paddingVertical:2,
    },
    note:{
        fontSize:30,
        marginHorizontal:10,
        marginVertical:5
    },
    form:{
        marginVertical:10,
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
        flex:0.08,
        flexDirection:'row',
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        alignItems: 'center',
        padding:5,
        width:'100%',
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
        flex:0.92,
        zIndex:-1,
    },
    picker:{
        color:'white',
        width:'100%',
        paddingVertical:15,
        borderBottomWidth: 1,
        borderColor:'#a9a9a9',
    },
    priority:{
        width: '100%',
        color:GreyBg,
    },
    itemStyle:{
        alignSelf:'center',
    }
})


























