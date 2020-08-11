import {ChatActionTypes, ChatState, ADD_MESSAGE, SET_NAME} from "./types";

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
        case SET_NAME:
            return { ...state, name: action.payload}
        default: return state
    }
}
