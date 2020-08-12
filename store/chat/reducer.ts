import {ChatActionTypes, ChatState, ADD_MESSAGE, SET_NAME, ACK_MESSAGE} from "./types";

export const initialState: ChatState = {
    messageObjs: []
};

export const chatReducer = (
    state = initialState,
    action: ChatActionTypes
): ChatState => {
    switch(action.type) {
        case ADD_MESSAGE:
            return { ...state, messageObjs: [...state.messageObjs, action.payload] }
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
