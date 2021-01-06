/* eslint-disable prettier/prettier */

import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';



export const DeleteOffline = async(item) => {
    let tasks = JSON.parse(await AsyncStorage.getItem('tasks'))
    if (!tasks)
    {
        tasks = []
    }
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


export const SaveOffline = async(req,offlineTask) => {
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
    newTasks.push(req)
    tasks.push(offlineTask)
    AsyncStorage.setItem('newTasks', JSON.stringify(newTasks));
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
}

export const ChangeOffline = async(item,req,offlineChange) => {
    let changedTasks = JSON.parse(await AsyncStorage.getItem('changedTasks'));
    let tasks = JSON.parse(await AsyncStorage.getItem('tasks'))
    if (!changedTasks)
    {
        changedTasks = []
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