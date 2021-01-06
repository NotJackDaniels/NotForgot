/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import Modal from 'react-native-modalbox'
import LottieView from 'lottie-react-native';

export default class Synchronization extends Component {
    constructor(props){
        super(props);
    }
    showSyncModal = () => {
        this.refs.Sync.open();
    }

    closeSyncModal = () => {
        this.refs.Sync.close();
    }

    render() {
        return (
                <Modal 
                ref={"Sync"}
                style={styles.modal}
                position='center'
                backdrop={true}
                onClosed={()=>{this.closeSyncModal()}}
                >
                    <Text style={{position:'absolute',bottom:10,left:10}}>Синхронизация данных</Text>
                </Modal>
                
        )
    }
}

const styles = StyleSheet.create({
    modal:{
        width:'80%',
        height:170,
        padding:20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    }
})
