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
import SaveModal from '../components/SaveModal.android';
import NetInfo from "@react-native-community/netinfo";
import { axiosGet, axiosPatch } from '../Api/AxiosApi';

export default class CreateTaskScreen extends Component {

    NetInfoSubscription = null;

    constructor(){
        super();
        this.state = {
            isVisible: false,
            priority:'',
            category:3,
            showDate:"Сделать до",
            date:'',
            allCategories:[],
            allPriorities:[],
            selected_id:'',
            connection_status:false,
            connection_type:null,
            connection_net_reachable:null,
            changedCategory:false,
            changedPriority:false,
        }
        this.AddCategory = this.AddCategory.bind(this);
    }

    _handleConnectivityChange = async(state) => {
        this.setState(
            {
                connection_status:state.isConnected,
                connection_type:state.type,
                connection_net_reachable:state.isInternetReachable,
            }
        )
    }

    componentWillUnmount(){
        this.NetInfoSubscription && this.NetInfoSubscription();
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
    handlePicker = (datetime) => {
        this.setState({
            isVisible:false,
            showDate : moment(datetime).format('DD.MM.YYYY'),
            date:moment(datetime,"DD.MM.YYYY").unix(),
        })
    }

    getCategory = async() => {
        const item = this.props.route.params.item;
        this.setState({category:item.category})
        this.setState({allCategories:await axiosGet('/categories')});
        const catData = JSON.stringify(this.state.allCategories);
        AsyncStorage.setItem('categories', catData);
    }

    getPriorities = async() => {
        const item = this.props.route.params.item;
        this.setState({priority:item.priority})
        this.setState({allPriorities:await axiosGet('/priorities')});
        const prData = JSON.stringify(this.state.allPriorities);
        AsyncStorage.setItem('priorities', prData);
    }

    Save(){
        this.refs.saveModal.showSaveModal();
    }

    saveAll = async() => {
        const {title,description,priority,category} = this.state;
        const item = this.props.route.params.item;
        let changedTasks = await AsyncStorage.getItem('changedTasks');
        changedTasks = JSON.parse(changedTasks);
        let tasks = JSON.parse(await AsyncStorage.getItem('tasks'))
        if (!changedTasks)
        {
            changedTasks = []
        }
        const req = {
          "title": title,
          "description":description,
          "done": item.done,
          "deadline":this.state.date,
          "category_id":category.id,
          "priority_id":priority.id,
        }
        if (this.state.connection_status){
            const res = await axiosPatch('/tasks',item.id,req)
            if(res)
            {
                this.goBack();
            }
        }
        else
        {
            const offlineChange = {
                "id":item.id,
                "title": title,
                "description":description,
                "done": item.done,
                "deadline":this.state.date,
                "category":category,
                "priority":priority,
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
            this.goBack();
        }
    }

    async onChangeHandle(state,value){
        await this.setState({
          [state]: value
        })
        console.warn(this.state.category);
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
            await this.getCategory();
            await this.getPriorities();
        }
        else
        {
            console.warn(1);
            this.getOfflineData();
        }
        const item = this.props.route.params.item;
        await this.setState({
            category:item.category,
            title:item.title,
            description:item.description,
            showDate:moment(item.deadline * 1000).format('DD.MM.YYYY'),
            date:item.deadline,
            priority:item.priority,
        })
        
    }

    AddCategory(){
        this.refs.addModal.showCategoryModal();
    }

    goBack =()=>{
        this.props.navigation.navigate('MainPage');
    }
    

    render() {
        const {title,description,priority,category} = this.state;
        
        return (
            <View style={styles.holeContent}>
            
                <View  style={styles.heading}>
                    <BackButton arrow={'<'} title={'Not forgot!'} style={styles.loginButton} onPress={() => {
                    this.Save()}}/>
                    <Text style={styles.textLoc}> Изменить заметку</Text>
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
                <SaveModal goBack={this.goBack} saveAll={this.saveAll}  ref={'saveModal'}/>
                
                
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
        height:'100%',
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
        height:'18%',
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
        height:'82%',
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