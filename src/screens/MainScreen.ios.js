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
import { axiosDelete, axiosGet, axiosPatch } from '../Api/AxiosApi';
import { SyncFunction } from '../Api/Sync';
import { ChangeOffline, DeleteOffline } from '../OfflineChanges/OfflineChanges';



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
            this.refs.Sync.showSyncModal();
            let sync =  await SyncFunction()
            this.getTasks();
            this.setState({synchronized:sync});
            if(this.state.synchronized)
            {
                this.refs.Sync.closeSyncModal();
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

    getTasks = async() =>{
        if(this.state.connection_status)
        {
            this.setState({allTasks:await axiosGet('/tasks')});
            const taskData = JSON.stringify(this.state.allTasks);
            AsyncStorage.setItem('tasks', taskData);
        }
        else
        {
            this.setState({allTasks:JSON.parse(await AsyncStorage.getItem('tasks'))});
        }
        this.setState({refreshing: false});
    } 

    changeValue = async(item) =>{
        const req = {
            "title": item.title,
            "description":item.description,
            "done":1,
            "deadline":item.date,
            "category_id":item.category.id,
            "priority_id":item.priority.id,
        }
        if (this.state.connection_status){
            await axiosPatch('/tasks',item.id,req)
            return this.checkValue(item);
        }
        else
        {
            ChangeOffline(item,req);
        }
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
            this.setState({allCategories:await axiosGet('/categories')});
            const catData = JSON.stringify(this.state.allCategories);
            AsyncStorage.setItem('categories', catData);
        }
        else
        {
            this.setState({allCategories:JSON.parse(await AsyncStorage.getItem('categories'))});
        }
    }

    deleteItem = async(item) => {
        if (this.state.connection_status){
            await axiosDelete('/tasks',item.id)
        }
        else
        {
            DeleteOffline(item);
        }
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
            <View style={{flex:1}}>
                <View  style={styles.heading}>
                    <Text style={styles.textLoc}> Not forgot! </Text>
                    <PlusButton title={'+'} style={styles.plusButton} onPress={() => {
                        this.props.navigation.navigate('CreateTask',{refresh: this.getTasks})}} />
                        <TouchableOpacity style={styles.exit} activeOpacity={0.5} onPress={()=>this.exit()}>
                            <Text style={{color:'white',}}>Выход</Text>
                        </TouchableOpacity>

                </View>
                <ScrollView style={{flex:1,backgroundColor:'white'}}
                refreshControl={<RefreshControl onRefresh={this._onRefresh} refreshing={this.state.refreshing}/>}>
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
                        <View style={{backgroundColor:'white',height:'100%'}}/>
                </ScrollView>
                <Synchronization ref={'Sync'} />
                <Lottie ref={'lottie'} />
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
        paddingHorizontal:10,
        paddingVertical:5,
        backgroundColor:'#f2f2f2',
    },
    imgText:{
        color:'white',
        alignSelf:'center',
        fontSize:20,
        fontWeight:'bold',
    },
})
