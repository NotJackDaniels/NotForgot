/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Platform, Image, KeyboardAvoidingView,Dimensions } from 'react-native';
//import {Picker} from '@react-native-community/picker';
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
import { Picker } from '@react-native-community/picker';
import SaveModal from '../components/SaveModal.android';
import NetInfo from "@react-native-community/netinfo";
import { ChangeOffline, SaveOffline } from '../OfflineChanges/OfflineChanges';
import { axiosGet, axiosPatch } from '../Api/AxiosApi';

const { height } = Dimensions.get('window');

export default class EditTaskScreen extends Component {

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
            description:'',
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
        if(title === undefined || description === undefined || this.state.date === undefined || category === undefined || priority === undefined)
        {
            alert('Заполнены не все поля!')
            return;
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
            ChangeOffline(item,req,offlineChange)
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
        const item = this.props.route.params.item;

        return (
            <KeyboardAvoidingView style={{height}}>
            
                <View  style={styles.heading}>
                    <TouchableOpacity style={{marginLeft:10,display:'flex'}} 
                        onPress={() => {this.Save()}}
                    >
                        <Image  source={require("../assets/arrow.png")}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:20,marginLeft:50}}>Not forgot!</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.note}>Изменить заметку</Text>
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
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end',marginBottom:10}}>
                            <Text>{description.length}/120</Text>
                        </View>
                        <View style={{width:'100%'}}>
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

                                        <Picker.Item key={category.id} label={category.name} value={category}/>)
                                        :
                                        <Picker.Item label="Категория" value="low" />
                                    }
                                </Picker>
                                { this.state.changedCategory === false  && 
                                <View style={{position:'absolute',borderTopLeftRadius:4,height:'100%',width:'80%',backgroundColor:'#f4f4f5',}}>
                                    <Text style={styles.pickerLabel}>{this.state.category.name}</Text>
                                </View>}
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
                                    <Picker.Item key={prior.id} label={prior.name} value={prior}/>
                                    ):
                                    <Picker.Item label="Ошибка" value="error" />
                                }
                            </Picker>
                            { this.state.changedPriority === false  && 
                                <View style={{position:'absolute',borderTopLeftRadius:4,height:'100%',width:'80%',backgroundColor:'#f4f4f5',}}>
                                    <Text style={styles.pickerLabel}>{this.state.priority.name}</Text>
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
                        <FilledButton title={'Сохранить'} onPress={() => {this.saveAll()}} />
                    </View>

                </View>
                <CategoryModal getCategory={this.getCategory} ref={'addModal'} />
                <SaveModal goBack={this.goBack} saveAll={this.saveAll}  ref={'saveModal'}/>
                
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    saveButton:{
        position:'absolute',
        bottom:20,
        width:'100%',
        padding:10,
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
    },
    pickerLabel:{
        top:'25%',
        fontSize:16,
        marginLeft:5,
        color:'#c1c1c4',
    }
})


























