import {SET_ACK_NOTIFICATIONS, SET_NAME, SET_SYN_NOTIFICATIONS, SettingsActionTypes, SettingsState} from "./types";

export  const initialState: SettingsState = {
    synNotifications: false,
    ackNotifications: false,
}

export const settings = (
    state = initialState,
    action: SettingsActionTypes): SettingsState => {
    switch(action.type) {
        case SET_NAME:
            return { ...state, name: action.payload }
        case SET_SYN_NOTIFICATIONS:
            return { ...state, synNotifications: action.payload }
        case SET_ACK_NOTIFICATIONS:
            return { ...state, ackNotifications: action.payload }
        default: return state
    }
}
