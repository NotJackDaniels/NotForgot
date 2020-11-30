/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, FlatList } from 'react-native'
import { PlusButton } from '../components/PlusButton'
import ActionButton from 'react-native-action-button';
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Task } from '../components/Task.android';
import CheckBox from '@react-native-community/checkbox';
import Swipeout from 'react-native-swipeout';

export default class MainScreen extends Component {

    constructor(){
        super();
        this.state = {
            allTasks:[],
            done:0,
            allCategories:[],
        }
    }

    componentDidMount()
    {
        this.getTasks();
        this.getCategory();
    }

    getTasks = async() =>{
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
           
        })
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
                console.warn(res.data);
                this.getTasks();
                return true;
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
    _listEmptyComponent = () => {
        return (
            <View>
                // any activity indicator or error component
            </View>
        )
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

    renderItem({item},id){
        const bg = item.priority.color;
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
                    <View style={{width:'100%',height:50,flexDirection: 'row',backgroundColor:'white'}}>
                        <View style={{height:'100%',width:5,backgroundColor:bg}}></View>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontSize:18,color:'black'}}> {item.title}</Text>
                            <Text multiline
                                        numberOfLines={1} style={{fontSize:16}}> {item.description}</Text>
                        </View>
                        <View style={{position:'absolute',right:0,alignSelf:"center",marginRight:10}} >
                            <CheckBox
                                tintColors={{true:PRIMARYANDROID}}
                                value={this.checkValue(item)}
                                onChange={()=>this.changeValue(item)}
                                />
                        </View>
                    </View>
                </Swipeout>
            )
        }
    }

    checkCategory(id){
        for (let i=0; i < this.state.allTasks.length; i++) {
            if (this.state.allTasks[i].category.id === id)
            {
                return true;
            }
        }
        return false;
    }



    render() {
        return (
            <View style={{flex:1}}>
                <View  style={styles.heading}>
                    <Text style={styles.textLoc}> Not forgot! </Text>
                    <PlusButton title={'+'} style={styles.plusButton} onPress={() => {
                        this.props.navigation.navigate('CreateTask')}} />

                </View>
                <View >
                    {this.state.allCategories.length ? 
                        this.state.allCategories.map(cat=>
                           this.checkCategory(cat.id) === true ?
                                <View>
                                    <Text style={styles.note}>{cat.name}</Text>
                                    <FlatList
                                        style={{borderTopWidth:1,borderColor:' rgba(60, 60, 67, 0.29);'}}
                                        data={this.state.allTasks}
                                        renderItem={(item) => this.renderItem(item, cat.id)}
                                    />
                                </View>:null
                            ):
                            <Text>Loading...</Text>
                        }
                        
                </View>
                <View style={{height:'100%',backgroundColor:'white'}}></View>
                
            </View>
           
        )
    }
}

const styles = StyleSheet.create({
    heading:{
        height:'22%',
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        justifyContent: 'center',
    },
    textLoc:{
        position: 'absolute',
        bottom:0,
        padding:5,
        color:'white',
        fontSize:30,
        fontWeight:'bold',
    },
    plusButton:{
        position: 'absolute',
        right:0,
    },
    note:{
        fontSize:15,
        marginHorizontal:10,
        marginVertical:5
    },
})
