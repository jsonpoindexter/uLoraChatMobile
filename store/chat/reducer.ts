import {ChatActionTypes, ChatState, ADD_MESSAGE, SET_NAME, ACK_MESSAGE, UserMessageObj} from "./types";

export const initialState: ChatState = {
    messageObjs: []
};

export const chatReducer = (
    state = initialState,
    action: ChatActionTypes
): ChatState => {
    switch(action.type) {
        case ADD_MESSAGE:
            const messageObj = action.payload
            if (isDuplicate(state, messageObj)) return state // Check for duplication
            return { ...state, messageObjs: [messageObj, ...state.messageObjs].sort((a, b) => a.timestamp < b.timestamp ? -1 : 0) }
        case ACK_MESSAGE:
            const timestamp = action.payload
            const index = state.messageObjs.findIndex(messageObj => messageObj.timestamp === timestamp)
            return {
                ...state,
                messageObjs: [
                    ...state.messageObjs.slice(0,index),
                    {
                        ...state.messageObjs[index],
                        ack: true,
                    },
                    ...state.messageObjs.slice(index + 1)
                ]
            }
        case SET_NAME:
            return { ...state, name: action.payload}
        default: return state
    }
}


const isDuplicate = (state:  ChatState, messageObj: UserMessageObj): boolean => {
    return !!state.messageObjs.find(curMessageObj =>
        `${curMessageObj.timestamp}:${curMessageObj.message}:${curMessageObj.sender}` ===
        `${messageObj.timestamp}:${curMessageObj.message}:${curMessageObj.sender}`)
}
