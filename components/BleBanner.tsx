import {Banner} from "react-native-paper";
import {ConnectionState} from "../store/ble/reducer";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {StyleSheet} from "react-native";

export default () => {
    const connectionState = useSelector((state: RootState) => state.ble.connectionState)
    const bleStatus = (): string => {
        switch (connectionState) {
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

