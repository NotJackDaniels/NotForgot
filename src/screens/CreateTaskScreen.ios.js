/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import {Picker} from '@react-native-community/picker';
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
import SaveModal from '../components/SaveModal';
import NetInfo from "@react-native-community/netinfo";

export default class CreateTaskScreen extends Component {

    NetInfoSubscription = null;

    constructor(){
        super();
        this.state = {
            isVisible: false,
            showDate:"Сделать до",
            date:'',
            allCategories:[],
            allPriorities:[],
            selected_id:'',
            description:'',
            connection_status:false,
            curDate:new Date(),
        }
        this.AddCategory = this.AddCategory.bind(this);
        this.Save = this.Save.bind(this);
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
        category:'',
        priority:'',
    }
    handlePicker = (datetime) => {
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
                const categoriesData = JSON.stringify(res.data);
                AsyncStorage.setItem('categories', categoriesData);
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
                const prioritiesData = JSON.stringify(res.data);
                AsyncStorage.setItem('priorities', prioritiesData);
                this.setState({allPriorities:res.data});
            },
            err => {alert("Ошибка запроса")}
          )
    }

    Save(){
        this.refs.saveModal.showSaveModal();
    }

    saveAll = async() => {
        const {title,description,priority,category} = this.state;
        console.warn(title,description,1,this.state.date,category,priority);
        let newTasks = await AsyncStorage.getItem('newTasks');
        let tasks = await AsyncStorage.getItem('tasks');
        newTasks = JSON.parse(newTasks);
        tasks = JSON.parse(tasks)
        if (!newTasks)
        {
            newTasks = []
        }
        if (!tasks)
        {
            tasks = []
        }
        const req = {
            "title": title,
            "description":description,
            "done": 0,
            "deadline":this.state.date,
            "category_id":category.id,
            "priority_id":priority.id,
        }
        if(title === undefined || description === undefined || this.state.date === undefined || category === undefined || priority === undefined)
        {
            alert('Заполнены не все поля!')
        }
        else{
            if(this.state.connection_status){
                const authAxios = axios.create({
                    baseURL: "http://practice.mobile.kreosoft.ru/public/api",
                    headers:{
                        'Accept' : 'application/json',
                        'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')}
                })
                authAxios.post('/tasks',req)
                .then(
                    res => {
                        this.goBack();
                    },
                    err => {alert("Ошибка запроса")}
                )
            }
            else
            {
                var RandomNumber = Math.floor(Math.random() * 100000) + 1 ;
                const offlineTask = {
                    'id':RandomNumber,
                    "title": title,
                    "description":description,
                    "done": 0,
                    "deadline":this.state.date,
                    "category":category,
                    "priority":priority,
                    "created":moment(this.state.curDate,"DD.MM.YYYY").unix(),
                    }
                newTasks.push(req)
                tasks.push(offlineTask)
                AsyncStorage.setItem('newTasks', JSON.stringify(newTasks));
                AsyncStorage.setItem('tasks', JSON.stringify(tasks));
                this.goBack();
            }
        }
    }

    onChangeHandle(state,value){
        this.setState({
          [state]: value
        })
    }

    getOfflineData = async() =>
    {
        this.setState({allCategories:JSON.parse(await AsyncStorage.getItem('categories'))});
        this.setState({allPriorities:JSON.parse(await AsyncStorage.getItem('priorities'))});
    }

    async componentDidMount()
    {
        
        this.NetInfoSubscription = NetInfo.addEventListener(
            await this._handleConnectivityChange,
        )
        if(this.state.connection_status)
        {
            this.getCategory();
            this.getPriorities();
        }
        else
        {
            console.warn(1);
            this.getOfflineData();
        }
    }

    componentWillUnmount(){
        this.NetInfoSubscription && this.NetInfoSubscription();
    }

    _handleConnectivityChange = (state) => {
        this.setState({connection_status:state.isConnected})
    }

    AddCategory(){
        this.refs.addModal.showCategoryModal();
    }

    goBack(){
        this.props.route.params.refresh();
        this.props.navigation.navigate('MainPage');
    }

    render() {
        const {title,description,priority,category} = this.state;
        
        return (
            <View style={styles.holeContent}>
            
                <View  style={styles.heading}>
                    <BackButton arrow={'<'} title={'Not forgot!'} style={styles.loginButton} onPress={() => {
                    this.goBack()}}/>
                    <Text style={styles.textLoc}> Добавить заметку</Text>
                </View>
                <View style={styles.content}>
                    <SafeAreaView style={styles.form}>
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
                                maxLength = {120}
                                value={description}
                                onChangeText={(value) => this.onChangeHandle('description',value)}
                            /> 
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end',marginBottom:10}}>
                            <Text>{description.length}/120</Text>
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
                                    {this.state.allCategories.length ?
                                        this.state.allCategories.map(category=>

                                        <Picker.Item key={category.id} label={category.name} value={category}/>)
                                        :
                                        <Picker.Item label="Категория" value="low" />
                                    }
                                </Picker>
                            </View>
                            <CategoryButton title={'+'} style={styles.plusButton} onPress={() => this.AddCategory()} />
                        </View>
                        <View style={{borderRadius:10,marginBottom:5,width:'100%',backgroundColor:'rgba(116, 116, 128, 0.08)',}}>
                            <Picker
                                selectedValue={priority}
                                itemStyle={styles.itemStyle}
                                style={styles.priority}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.onChangeHandle('priority',itemValue)
                                }>

                                {this.state.allPriorities.length ?
                                    this.state.allPriorities.map(prior=>
                                    <Picker.Item key={prior.id} label={prior.name} value={prior}/>
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
                <CategoryModal getCategory={this.getCategory} ref={'addModal'} />
                <SaveModal saveAll={this.saveAll} ref={'saveModal'}/>
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
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
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
        zIndex:-1,
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
        color:GreyBg,
        backgroundColor:'transparent',
        alignSelf: 'stretch', 
        alignItems:'center', 
        justifyContent:'center',
    },
    itemStyle:{
        alignSelf:'center',
    }
})