export const ADD_MESSAGE = 'SEND_MESSAGE'
export const SET_NAME = 'SET_NAME'

export enum MessageType {
    ACK = 'ACK'
}

export interface MessageObj {
    timestamp: number,
    message: string,
    sender: string
    type?: MessageType
    ack: boolean
}

export interface ChatState {
    messageObjs: MessageObj[]
    name?: string
}

interface SendMessageAction {
    type: typeof ADD_MESSAGE
    payload: MessageObj
}

interface SetNameAction {
    type: typeof SET_NAME
    payload: string
}

export type ChatActionTypes = SendMessageAction | SetNameAction
