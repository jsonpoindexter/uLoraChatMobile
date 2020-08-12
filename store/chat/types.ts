export const ADD_MESSAGE = 'SEND_MESSAGE'
export const SET_NAME = 'SET_NAME'
export const ACK_MESSAGE = 'ACK_MESSAGE'

export enum NodeMessageType {
    MSG = 'MSG', // User Message
    SYS = 'SYS', // System Message for logging
    ACK = 'ACK', // Used for acknowledging a message has been received
    SYN = 'SYN', // Used for displaying node status
}

export type UserMessageObj = {
    type: NodeMessageType.MSG
    timestamp: number,
    message: string,
    sender: string
    ack: boolean
}

export type SynMessageObj = {
    type: NodeMessageType.SYN
    address: string,
    rssi: number,
}

export type AckMessageObj = {
    type: NodeMessageType.ACK
    timestamp: number
}


export interface ChatState {
    messageObjs: UserMessageObj[]
    name?: string
}

interface SendMessageAction {
    type: typeof ADD_MESSAGE
    payload: UserMessageObj
}

interface SetNameAction {
    type: typeof SET_NAME
    payload: string
}

interface AckMessageAction {
    type: typeof ACK_MESSAGE
    payload: number
}

export type ChatActionTypes = SendMessageAction | SetNameAction | AckMessageAction
