import {ADD_MESSAGE, ChatActionTypes, UserMessageObj, SET_NAME, ACK_MESSAGE} from "./types";

export const addMessage = (messageObj: UserMessageObj): ChatActionTypes => {
    return {
        type: ADD_MESSAGE,
        payload: messageObj
    }
}

export const ackMessage = (timestamp: number) => {
    return {
        type: ACK_MESSAGE,
        payload: timestamp
    }
}

export const setName = (name: string): ChatActionTypes => {
    return {
        type: SET_NAME,
        payload: name
    }
}




