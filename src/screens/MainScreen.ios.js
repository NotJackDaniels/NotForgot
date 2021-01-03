/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, FlatList, TouchableOpacity, Image, ImageBackground,RefreshControl, TouchableWithoutFeedback, ScrollView, SafeAreaView  } from 'react-native'
import { PlusButton } from '../components/PlusButton'
import ActionButton from 'react-native-action-button';
import { PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Task } from '../components/Task.android';
import CheckBox from '@react-native-community/checkbox';
import Swipeout from 'react-native-swipeout';
import NetInfo from "@react-native-community/netinfo";
import Synchronization from '../components/Synchronization.android';
import LottieView from 'lottie-react-native';
import Lottie from './Lottie';



export default class MainScreen extends Component {

    NetInfoSubscription = null;

    constructor(){
        super();
        this.state = {
            allTasks:[],
            done:0,
            allCategories:[],
            selectedItem: null,
            connection_status:null,
            connection_type:null,
            connection_net_reachable:null,
            refreshing:null,
            synchronized:null,
        }
    }
    async componentDidMount()
    {
         this.NetInfoSubscription = NetInfo.addEventListener(
            await this._handleConnectivityChange,
        )
        await this.getCategory();
        this.getTasks();
    }

    componentWillUnmount(){
        this.NetInfoSubscription && this.NetInfoSubscription();
    }

    _handleConnectivityChange = async(state) => {

        if (this.state.connection_status === false)
        {
            await this.SyncFunction();
            if(this.state.synchronized)
            {
                this.refs.lottie.showLottieModal();
                setTimeout(() => {
                    this.refs.lottie.closeLottieModal();
                }, 6000);
                this.setState({synchronized:false})
            }
        }
        this.setState(
            {
                connection_status:state.isConnected,
                connection_type:state.type,
                connection_net_reachable:state.isInternetReachable,
            }
        )
    }

    SaveNewTask = async(task) =>{
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')}
        })
        await authAxios.post('/tasks',task)
        .then(
            res => {
                console.warn('ok')
            },
            err => {alert("Ошибка запроса")}
        )
    }
    DeteleTasksSync = async(id) =>{
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
        })
        await authAxios.delete((`/tasks/${id}`))
            .then(
                res => {
                    this.getTasks();
            },
                err => {alert(err)})
    }

    ChangeTasksSync = async(item) =>{
        const authAxios = axios.create({
            baseURL: "http://practice.mobile.kreosoft.ru/public/api",
            headers:{
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
        })
        await authAxios.patch((`/tasks/${item.itemId}`),item.req)
        .then(
            res => {
                this.getTasks();
                return this.checkValue(item);
            },
            err => {alert(err)}
        )
    }


    SyncFunction = async() =>{
        let newTasks = JSON.parse(await AsyncStorage.getItem('newTasks'))
        let deletedTasks = JSON.parse(await AsyncStorage.getItem('deletedTasks'))
        let changedTasks = JSON.parse(await AsyncStorage.getItem('changedTasks'))
        if (newTasks)
        {
            console.warn(newTasks)
            Object.keys(newTasks).forEach((key) => {
                this.SaveNewTask(newTasks[key]);
              })
            AsyncStorage.removeItem('newTasks');
        }
        if (deletedTasks){
            Object.keys(deletedTasks).forEach((key) => {
                this.DeteleTasksSync(deletedTasks[key]);
              })
        }
        console.warn(changedTasks);
        if (changedTasks){
            Object.keys(changedTasks).forEach((key) => {
                this.ChangeTasksSync(changedTasks[key]);
              })
        }
        AsyncStorage.removeItem('deletedTasks');
        AsyncStorage.removeItem('changedTasks');
        this.getTasks();
        this.setState({synchronized:true});
    }

    getTasks = async() =>{
        if(this.state.connection_status)
        {
            const authAxios = axios.create({
                baseURL: "http://practice.mobile.kreosoft.ru/public/api",
                headers:{
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
               
            })
            authAxios.get('/tasks')
              .then(
                res => {
                    const taskData = JSON.stringify(res.data);
                    AsyncStorage.setItem('tasks', taskData);
                    this.setState({allTasks:res.data});
                },
                err => {alert("Ошибка запроса22")}
              )
        }
        else
        {
            this.setState({allTasks:JSON.parse(await AsyncStorage.getItem('tasks'))});
        }
        console.warn(111)
        this.setState({refreshing: false});
    } 

    changeValue = async(item) =>{
        let changedTasks = await AsyncStorage.getItem('changedTasks');
        changedTasks = JSON.parse(changedTasks);
        let tasks = JSON.parse(await AsyncStorage.getItem('tasks'))
        if (!changedTasks)
        {
            changedTasks = []
        }
        const req = {
            "title": item.title,
            "description":item.description,
            "done":1,
            "deadline":item.date,
            "category_id":item.category.id,
            "priority_id":item.priority.id,
        }
        if(this.state.connection_status){
            const authAxios = axios.create({
                baseURL: "http://practice.mobile.kreosoft.ru/public/api",
                headers:{
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
            })
            authAxios.patch((`/tasks/${item.id}`),req)
            .then(
                res => {
                    console.warn('ok')
                    return this.checkValue(item);
                },
                err => {alert(err)}
            )
        }
        else
        {
            const offlineChange = {
                "id":item.id,
                "title": item.title,
                "description":item.description,
                "done": 1,
                "deadline":item.deadline,
                "category":item.category,
                "priority":item.priority,
                'created':item.created,
            }
            const req1 = {
                itemId:item.id,
                req:req,
            }
            changedTasks.push(req1);
            AsyncStorage.setItem('changedTasks', JSON.stringify(changedTasks));
            let alteredTasks = tasks.filter(function(e){
                return e.id !== offlineChange.id
            })
            AsyncStorage.removeItem('tasks');
            alteredTasks.push(offlineChange);
            console.warn(alteredTasks);
            AsyncStorage.setItem('tasks', JSON.stringify(alteredTasks));
        }
        this.getTasks();
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
        if(this.state.connection_status)
        {
            const authAxios = axios.create({
                baseURL: "http://practice.mobile.kreosoft.ru/public/api",
                headers:{
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
            
            })
            authAxios.get('/categories')
            .then(
                res => {
                    const catData = JSON.stringify(res.data);
                    AsyncStorage.setItem('categories', catData);
                    this.setState({allCategories:res.data});
                },
                err => {alert("Ошибка запроса111")}
            )
        }
        else
        {
            this.setState({allCategories:JSON.parse(await AsyncStorage.getItem('categories'))});
        }
    }

    deleteItem = async(item) => {
        let tasks = JSON.parse(await AsyncStorage.getItem('tasks'))
        if (!tasks)
        {
            tasks = []
        }
        if(this.state.connection_status){
            const authAxios = axios.create({
                baseURL: "http://practice.mobile.kreosoft.ru/public/api",
                headers:{
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')},
            })
            authAxios.delete((`/tasks/${item.id}`))
                .then(
                    res => {
                        console.warn('ok')
                },
                    err => {alert(err)})
        }
        else
        {
            let deletedTasks = await AsyncStorage.getItem('deletedTasks');
            deletedTasks = JSON.parse(deletedTasks);
            if (!deletedTasks)
            {
                deletedTasks = []
            }
            deletedTasks.push(item.id)
            AsyncStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
            let alteredTasks = tasks.filter(function(e){
                return e.id !== item.id
            })
            AsyncStorage.removeItem('tasks');
            AsyncStorage.setItem('tasks', JSON.stringify(alteredTasks));

        }
        this.getTasks();
    }
    ShowTaskDetails(item){
        this.props.navigation.navigate('Details',{item: item,refresh: this.getTasks});
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
                   
                    <TouchableOpacity style={{width:'100%',height:50,flexDirection: 'row',backgroundColor:'white'}}
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

    
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.getTasks();
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
                <View style={{backgroundColor:'rgba(239, 239, 244, 1)',height:'100%'}}
                refreshControl={<RefreshControl onRefresh={this._onRefresh} refreshing={this.state.refreshing}/>}
                >
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
