/* eslint-disable prettier/prettier */
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react'


const authAxios = axios.create({
    baseURL: "http://practice.mobile.kreosoft.ru/public/api",
})

authAxios.interceptors.request.use(
    async config => {
      config.headers = {
        'Accept' : 'application/json',
        'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
      }
      return config;
    },
    error => {
      Promise.reject(error);
  });





export const axiosGet = async(path) => {

    let response =  await authAxios.get(path);
    if (response)
    {
        
        return response.data;
    }
    else {
        alert('ошибка запроса');
    }
}

export const axiosPost = async(path,req) => {
    console.warn('noooooooooo')
    let response = await authAxios.post(path,req);
    if (response)
    {
        console.warn('created!')
        return response;
    }
    else {
        alert('ошибка запроса');
    }
}

export const axiosDelete = async(path,itemId) => {

    let response = await authAxios.delete((`${path}/${itemId}`));
    if (response)
    {
        console.warn('deleted!')
    }
    else {
        alert('ошибка запроса');
    }
}

export const axiosPatch = async(path,itemId,req) =>{
    let response = await authAxios.patch((`${path}/${itemId}`),req);
    if (response)
    {
        console.warn('updated!')
        return response;
    }
    else {
        alert('ошибка запроса');
    }
}