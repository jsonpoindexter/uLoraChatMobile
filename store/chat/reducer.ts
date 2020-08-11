import {ChatActionTypes, ChatState, SEND_MESSAGE, SET_NAME} from "./types";

export const initialState: ChatState = {
    messageObjs: [{
        sender: 'Jason',
        message: 'test',
        timestamp: new Date().getTime(),
            ack: false
    }]
};

export const chatReducer = (
    state = initialState,
    action: ChatActionTypes
): ChatState => {
    switch(action.type) {
        case SEND_MESSAGE:
            return { messageObjs: [...state.messageObjs, action.payload] }
        case SET_NAME:
            return { ...state, name: action.payload}
        default: return state
    }
}
