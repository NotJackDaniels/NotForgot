/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, FlatList, TouchableOpacity, Image } from 'react-native'
import { PlusButton } from '../components/PlusButton'
import ActionButton from 'react-native-action-button';
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Task } from '../components/Task.android';
import CheckBox from '@react-native-community/checkbox';
import Swipeout from 'react-native-swipeout';
import { InMemoryCache } from '@apollo/client/core';
import { isNonNullType } from 'graphql';



export default class MainScreen extends Component {

    constructor(){
        super();
        this.state = {
            allTasks:[],
            done:0,
            allCategories:[],
            selectedItem: null,
        }
        this.getTasks();
    }
    componentDidMount()
    {
        this.getCategory();

    }

    getTasks = async() =>{
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
           
        })
        const tasks = await AsyncStorage.getItem('tasks')
        
        if(tasks) {
            try {
              const tasksResp = await authAxios.get('/tasks')
              const taskData = await JSON.stringify(tasksResp.data)
              await AsyncStorage.setItem('tasks', taskData);
            } catch(e) {
              console.warn("fetch Error: ", e)
           }
        }
        this.state.allTasks = JSON.parse(await AsyncStorage.getItem('tasks'));
        authAxios.get('/tasks')
          .then(

            res => {
                this.setState({allTasks:res.data});
            },
            err => {alert("Ошибка запроса")}
          )
    } 

    changeValue = async(item) =>{
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
        })
        const req = {
            "title": item.title,
            "description":item.description,
            "done":1,
            "deadline":item.date,
            "category_id":item.category.id,
            "priority_id":item.priority.id,
          }
        authAxios.patch((`/tasks/${item.id}`),req)
          .then(
            res => {
                this.getTasks();
                return this.checkValue(item);
            },
            err => {alert(err)}
          )
    }

    checkValue(item){
        if (item.done === 1){
            return true;
        }
        else {
            return false;
        }
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

    deleteItem = async(item) => {
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
        })
        authAxios.delete((`/tasks/${item.id}`))
            .then(
                res => {
                    this.getTasks();
            },
                err => {alert(err)}
            )
    }
    ShowTaskDetails(item){
        this.props.navigation.navigate('Details',{item: item,refresh: this.getTasks});
    }

    renderItem({item},id){
        const bg = item.priority.color;
        const isSelected = (this.state.selectedItem === item.id);
        let swipeBtns = [{
            text: 'Delete',
            backgroundColor: 'red',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () =>  this.deleteItem(item)  
          }];
        if(item.category.id === id)
        {
            return(
                <Swipeout 
                    right={swipeBtns}
                    autoClose='true'
                    backgroundColor= 'transparent'>
                    <TouchableOpacity 
                        style={{width:'100%',height:50,flexDirection: 'row'}}
                     onPress={()=>this.ShowTaskDetails(item)}
                    >
                        <View style={{height:'100%',width:5,backgroundColor:bg}}></View>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontSize:18,color:'black'}}> {item.title}</Text>
                            <Text multiline
                                        numberOfLines={1} style={{fontSize:16}}> {item.description}</Text>
                        </View>
                        <View style={{position:'absolute',right:0,alignSelf:"center",marginRight:10}} >
                            <CheckBox                         
                                tintColors={{true:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID}}
                                onChange={()=>this.changeValue(item)}
                                value={this.checkValue(item)}
                                disabled={this.checkValue(item)}
                                />
                        </View>
                    </TouchableOpacity>
                </Swipeout>
            )
        }
    }

    checkCategory(id){
        if(this.state.allTasks !== null){
            for (let i=0; i < this.state.allTasks.length; i++) {
                if (this.state.allTasks[i].category.id === id)
                {
                    return true;
                }
            }
        }
        return false;
    }

    exit = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }
    
    render() {
        return (
            <View style={{flex:1}}>
                <View  style={styles.heading}>
                    <Text style={styles.textLoc}> Not forgot! </Text>
                    <TouchableOpacity style={styles.exit} activeOpacity={0.5} onPress={()=>this.exit()}>
                        <Image
                        source={require('../images/logout.png')}
                        style={{height:20,width:20,color:'white'}}
                        tintColor = 'white'
                        />
                    </TouchableOpacity>
                </View>
                <View >
                    {this.state.allTasks && this.state.allTasks.length ? 
                        this.state.allCategories.map(cat=>
                           this.checkCategory(cat.id) === true ?
                                <View>
                                    <Text style={styles.note}>{cat.name}</Text>
                                    <FlatList
                                        data={this.state.allTasks}
                                        renderItem={(item) => this.renderItem(item, cat.id)}
                                        keyExtractor={(item, index) => `item-${index}`}
                                    />
                                </View>:null
                            ):
                            <View style={{alignItems:'center',marginTop:70}}>
                                <Image
                                source={require('../images/noTasks.png')}
                                />
                                <Text style={{marginTop:20}}>У вас пока нет дел.</Text>
                                <Text> Счастливый вы человек!</Text>
                            </View>
                        }
                </View>
                <ActionButton buttonColor={PRIMARYANDROID}
                    onPress={() => {
                        this.props.navigation.navigate('CreateTask',{refresh: this.getTasks}) }}
                ></ActionButton>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    heading:{
        height:50,
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        justifyContent: 'center',
    },
    textLoc:{
        position: 'absolute',
        padding:5,
        color:'white',
        fontSize:20,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
      },
    note:{
        fontSize:22,
        marginHorizontal:10,
        marginVertical:5
    },
    exit:{
        marginRight:15,
        position:'absolute',
        right:0,
        height:20,
        width:20,
    }
})