/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native'
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
                console.warn(1);
              const tasksResp = await authAxios.get('/tasks')
              const taskData = await JSON.stringify(tasksResp.data)
              await AsyncStorage.setItem('tasks', taskData);
            } catch(e) {
              console.warn("fetch Error: ", e)
           }
        }
        this.setState({allTasks:JSON.parse(await AsyncStorage.getItem('tasks'))});
        authAxios.get('/tasks')
          .then(
            res => {
                const taskData = JSON.stringify(res.data);
                AsyncStorage.setItem('tasks', taskData);
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
                                tintColors={{true:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID}}
                                onChange={()=>this.changeValue(item)}
                                value={this.checkValue(item)}
                                disabled={this.checkValue(item)}
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

    exit = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                <View  style={styles.heading}>
                    <Text style={styles.textLoc}> Not forgot! </Text>
                    <PlusButton title={'+'} style={styles.plusButton} onPress={() => {
                        this.props.navigation.navigate('CreateTask',{refresh: this.getTasks})}} />
                        <TouchableOpacity style={styles.exit} activeOpacity={0.5} onPress={()=>this.exit()}>
                            <Text style={{color:'white',}}>Выход</Text>
                        </TouchableOpacity>

                </View>
                <View >
                    {this.state.allTasks && this.state.allTasks.length ? 
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
                            <View style={{width:'80%',alignSelf:'center'}}>
                                <ImageBackground  source={require('../images/noTasksSanta.png')} 
                                    imageStyle={{ borderRadius: 10 }}
                                    style={{justifyContent:'center',marginTop:100,backgroundColor:'white',height:200}}>
                                    <Text style={styles.imgText}>У вас пока нет дел.</Text>
                                    <Text style={styles.imgText}> Счастливый вы человек!</Text>
                                </ImageBackground>
                            </View>
                            
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
    exit:{
        position:'absolute',
        right:0,
        top:0,
        margin:10,
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
    imgText:{
        color:'white',
        alignSelf:'center',
        fontSize:20,
        fontWeight:'bold',
    },
})
