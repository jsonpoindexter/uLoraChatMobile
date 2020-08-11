import {SEND_MESSAGE, ChatActionTypes, MessageObj, SET_NAME} from "./types";

export const sendMessage = (messageObj: MessageObj): ChatActionTypes => {
    return {
        type: SEND_MESSAGE,
        payload: messageObj
    }
}

export const setName = (name: string): ChatActionTypes => {
    return {
        type: SET_NAME,
        payload: name
    }
}


