import {SET_ACK_NOTIFICATIONS, SET_NAME, SET_SYN_NOTIFICATIONS, SettingsActionTypes} from "./types";
import AsyncStorage from '@react-native-community/async-storage';

export const setName = (name: string): SettingsActionTypes => {
    AsyncStorage.setItem('NAME', name).catch(err => console.log(err))
    return {
        type: SET_NAME,
        payload: name
    }
}

export const setSynNotifications = (value: boolean): SettingsActionTypes => {
    AsyncStorage.setItem('SYN_NOTIFICATIONS_ENABLED', value.toString()).catch(err => console.log(err))
    return {
        type: SET_SYN_NOTIFICATIONS,
        payload: value
    }
}

export const setAckNotifications = (value: boolean): SettingsActionTypes => {
    AsyncStorage.setItem('ACK_NOTIFICATIONS_ENABLED', value.toString()).catch(err => console.log(err))
    return {
        type: SET_ACK_NOTIFICATIONS,
        payload: value
    }
}

