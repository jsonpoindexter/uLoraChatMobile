import {ADD_MESSAGE, ChatActionTypes, MessageObj, SET_NAME} from "./types";

export const addMessage = (messageObj: MessageObj): ChatActionTypes => {
    return {
        type: ADD_MESSAGE,
        payload: messageObj
    }
}

export const setName = (name: string): ChatActionTypes => {
    return {
        type: SET_NAME,
        payload: name
    }
}


