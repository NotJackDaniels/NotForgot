/* eslint-disable prettier/prettier */

import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import { axiosDelete, axiosPatch, axiosPost } from './AxiosApi';

const SaveNewTask = async(task) =>{

    await axiosPost('/tasks',task);
}
const DeteleTasksSync = async(id) =>{
    await axiosDelete('/tasks',id);
}

const ChangeTasksSync = async(item) =>{

    await axiosPatch('/tasks',item.itemId,item.req);
}


export const SyncFunction = async() =>{
    let synchronized = await WaitChanges();
    return synchronized;
}

const WaitChanges = async() =>{
    let newTasks = JSON.parse(await AsyncStorage.getItem('newTasks'))
    AsyncStorage.removeItem('newTasks');
    if (newTasks)
    {
        console.warn(newTasks)
        Object.keys(newTasks).forEach((key) => {
            SaveNewTask(newTasks[key]);
          })
          newTasks=[]
    }
    let deletedTasks = JSON.parse(await AsyncStorage.getItem('deletedTasks'))
    if (deletedTasks){
        Object.keys(deletedTasks).forEach((key) => {
            DeteleTasksSync(deletedTasks[key]);
          })
          deletedTasks = [];
          AsyncStorage.removeItem('deletedTasks');
    }
    let changedTasks = JSON.parse(await AsyncStorage.getItem('changedTasks'))
    if (changedTasks){
        Object.keys(changedTasks).forEach((key) => {
            ChangeTasksSync(changedTasks[key]);
          })
          changedTasks = [];
          AsyncStorage.removeItem('changedTasks');
    }
    return true;
}