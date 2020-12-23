/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Platform, Image, KeyboardAvoidingView, Dimensions } from 'react-native';
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
import SaveModal from '../components/SaveModal';
import { GreyBg, PRIMARY, PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const { height } = Dimensions.get('window');

export default class CreateTaskScreen extends Component {

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
        console.warn(title,description,1,this.state.date,category,priority);
        const req = {
          "title": title,
          "description":description,
          "done": 0,
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
                this.goBack();
            },
            err => {alert("Заполнены не все поля!")}
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

    goBack(){
        this.props.route.params.refresh();
        this.props.navigation.navigate('MainPage');
    }
    


    render() {
        const {title,description,priority,category} = this.state;
        return (
            <KeyboardAvoidingView style={{height}} >
            
                <View  style={styles.heading}>
                    <TouchableOpacity style={{marginLeft:10,display:'flex'}} 
                        onPress={() => {this.goBack()}}
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
                                maxLength = {120}
                                onChangeText={(value) => this.onChangeHandle('description',value)}
                            /> 
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end',marginBottom:10}}>
                            <Text>{description.length}/120</Text>
                        </View>
                        <View style={{width:'100%',borderTopLeftRadius:4}}>
                            <View style={{marginBottom:5,borderTopLeftRadius:4,
                                         borderTopRightRadius:4,width:'90%',backgroundColor:'rgba(116, 116, 128, 0.08)',}}>
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
                                { this.state.category === undefined  && 
                                    <View style={{position:'absolute',borderTopLeftRadius:4,height:'100%',width:'80%',backgroundColor:'#f4f4f5',}}>
                                        <Text style={styles.pickerLabel}>Категория</Text>
                                    </View>
                                }
                            </View>
                            <CategoryButton title={'+'} style={styles.plusButton} onPress={() => this.AddCategory()} />
                        </View>
                        <View style={{marginBottom:5,width:'100%',borderTopLeftRadius:4,borderTopRightRadius:4,
                        backgroundColor:'rgba(116, 116, 128, 0.08)',}}>
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
                            { priority === undefined  && 
                            <View style={{position:'absolute',borderTopLeftRadius:4,height:'100%',width:'80%',backgroundColor:'#f4f4f5',}}>
                                <Text style={styles.pickerLabel}>Приоритет</Text>
                            </View>}
                            
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
                
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    saveButton:{
        position:'absolute',
        bottom:25,
        width:'100%',
        padding:10,
    },
    holeContent:{
        
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
        minHeight:'8%',
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
        height:'92%',
        zIndex:-1,
    },
    picker:{
        color:'white',
        width:'100%',
        paddingVertical:5,
        borderBottomWidth: 1,
        borderColor:'#a9a9a9',
        marginTop:10,
    },
    priority:{
        width: '100%',
        color:GreyBg,
        borderTopRightRadius:4,
        borderTopLeftRadius:4,
    },
    itemStyle:{
        alignSelf:'center',
    },
    pickerLabel:{
        top:'25%',
        fontSize:16,
        marginLeft:5,
        color:'#c1c1c4',
    }
})


























