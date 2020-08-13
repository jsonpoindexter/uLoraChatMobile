import {ADD_MESSAGE, ChatActionTypes, UserMessageObj, ACK_MESSAGE} from "./types";

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
