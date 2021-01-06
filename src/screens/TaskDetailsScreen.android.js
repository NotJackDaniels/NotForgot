/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image,Platform, SafeAreaView } from 'react-native'
import { FilledButton } from '../components/FilledButton'
import { PRIMARYANDROID, PRIMARYIOS } from '../globalStyles/colors'
import moment from 'moment';




export default class TaskDetailsScreen extends Component {
    constructor(){
        super();
        this.state = {
            done:'',
            doneColor:''
        }
    }
    componentDidMount(){
        this.doneCheck(this.props.route.params.item)
    }
    doneCheck(item){
        console.warn(item)
        if(item.done === 1)
        {
            this.setState({done:'Выполнено',doneColor:'#06B003'})
            
        }
        else{
            this.setState({done:'Не выполнено',doneColor:'#F61919'})
        }
    }


    editTask(){
        this.props.navigation.navigate('Edit',{item: this.props.route.params.item,
            refreshMain:this.props.route.params.refresh});
    }

    goBack(){
        this.props.route.params.refresh();
        this.props.navigation.navigate('MainPage');
    }

    render() {
        const item = this.props.route.params.item;
        const deadline = moment(item.deadline * 1000).format('DD.MM.YYYY')
        const created = moment(item.created * 1000).format('DD.MM.YYYY')
        const bg = item.priority.color;
        return (
            <View style={styles.holeContent}>
                <View  style={styles.heading}>
                    <TouchableOpacity style={{marginLeft:10,display:'flex'}} 
                        onPress={() => {this.goBack()}}
                    >
                        <Image  source={require("../assets/arrow.png")}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:20,marginLeft:50}}>Not forgot!</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.note}>{item.title}</Text>
                    <SafeAreaView style={styles.form}>
                        <View stylee={{flexDirection:'row'}}>
                            <Text>
                                {created}
                            </Text>
                            <Text style={{right:0,position:'absolute',color:this.state.doneColor}}>
                                {this.state.done}
                            </Text>
                        </View>
                        <View style={{marginVertical:5}}>
                            <Text style={{color:'black'}}>{item.description}</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginVertical:5}}>
                            <Image style={{marginRight:5}} source={require("../images/Vector.png")}/>
                            <Text style={{textAlign:'center'}}>до {deadline}</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginVertical:5}}>
                            <View style={{flexDirection:'row',textAlign:'center'}}>
                                <Image style={{marginRight:5}} source={require("../images/Vector2.png")}/>
                                <Text style={{alignSelf:'center'}}>{item.category.name}</Text>
                            </View>
                            <View style={{position:'absolute',backgroundColor:bg,borderRadius:5,right:0,paddingVertical:2,paddingHorizontal:5}}>
                                <Text style={{alignSelf:'center',color:'white'}}>{item.priority.name}</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
                <View style={styles.editButton}>
                    <FilledButton title={'Редактировать'} onPress={() => {this.editTask()}} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    heading:{
        flex:0.08,
        flexDirection:'row',
        backgroundColor:Platform.OS === 'ios' ? PRIMARYIOS : PRIMARYANDROID,
        alignItems: 'center',
        padding:5,
        width:'100%',
    },
    holeContent:{
        flex:1,
    },
    note:{
        fontSize:30,
        marginHorizontal:10,
        marginVertical:5,
    },
    content:{
        flex:0.92,
        zIndex:-1,
    },
    editButton:{
        position:'absolute',
        bottom:0,
        width:'100%',
        padding:10,
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
})

