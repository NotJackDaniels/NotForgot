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
        this.setState({
            isVisible:false,
            showDate : moment(datetime).format('MMMM,Do YYYY'),
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
    Save(){
        this.refs.saveModal.showSaveModal();
    }

    saveAll = async() => {
        const {title,description,priority,category} = this.state;
        const item = this.props.route.params.item;
        const req = {
          "title": title,
          "description":description,
          "done": item.done,
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
        authAxios.patch((`/tasks/${item.id}`),req)
          .then(
            res => {
                console.warn(res);
                this.goBack();
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
        const item = this.props.route.params.item;
        this.setState({
            category:item.category.id,
            title:item.title,
            description:item.description,
            showDate:moment(item.deadline * 1000).format('DD.MM.YYYY'),
            priority:item.priority.id
        })
    }

    AddCategory(){
        this.refs.addModal.showCategoryModal();
    }

    goBack(){
        this.props.route.params.refreshMain();
        this.props.navigation.navigate('MainPage');
    }

    render() {
        const {title,description,priority,category} = this.state;
        
        return (
            <View style={styles.holeContent}>
            
                <View  style={styles.heading}>
                    <BackButton arrow={'<'} title={'Not forgot!'} style={styles.loginButton} onPress={() => {
                    this.goBack()}}/>
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

                                        <Picker.Item key={category.id} label={category.name} value={category.id}/>)
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
                        <FilledButton title={'Сохранить'} onPress={() => {this.Save()}} />
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