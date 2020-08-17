import {Banner} from "react-native-paper";
import {ConnectionState} from "../store/ble/reducer";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {StyleSheet} from "react-native";
import {State} from 'react-native-ble-plx'


export default () => {
    const {connectionState, bleState} = useSelector((state: RootState) => state.ble)
    const bleStatus = (): string => {
        switch(bleState) {
            case State.PoweredOff:
                return "Bluetooth is powered off"
        }
        switch (connectionState) {
            case ConnectionState.LOC_SERVICES_DISABLED:
                return "Location services are disabled"
            case ConnectionState.CONNECTING:
                return 'Connecting...';
            case ConnectionState.DISCOVERING:
                return 'Discovering...';
            case ConnectionState.CONNECTED:
                return 'Connected';
            case ConnectionState.DISCONNECTED:
            case ConnectionState.DISCONNECTING:
        }
        return 'Searching...';
    }
    return (
        <Banner visible={connectionState !== ConnectionState.CONNECTED} actions={[]} style={styles.dropDownStatus}> Bluetooth Status: {bleStatus()}</Banner>
    )
}

const styles = StyleSheet.create({
    dropDownStatus: {
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'lightgrey'
    },
})

