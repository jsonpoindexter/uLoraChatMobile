export const SET_NAME = 'SET_NAME'
export const SET_SYN_NOTIFICATIONS = 'SET_SYN_NOTIFICATIONS'
export const SET_ACK_NOTIFICATIONS = 'SET_ACK_NOTIFICATIONS'


export interface SettingsState {
    name?: string, // Name used when sending a message / [ACK] knowledge
    synNotifications: boolean, // Generate local notifications on received SYN
    ackNotifications: boolean,
}

interface SetNameAction {
    type: typeof SET_NAME
    payload: string
}

interface SetSynNotifications {
    type: typeof  SET_SYN_NOTIFICATIONS,
    payload: boolean,
}

interface SetAckNotifications {
    type: typeof  SET_ACK_NOTIFICATIONS,
    payload: boolean,
}

export type SettingsActionTypes = SetNameAction | SetSynNotifications | SetAckNotifications
