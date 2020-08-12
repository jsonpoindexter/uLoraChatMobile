import {ADD_NODE, NodeActionTypes, NodesState, REMOVE_NODE} from "./types";

export const initialState: NodesState = {}

export const nodes = (state = initialState, action: NodeActionTypes) => {
    switch(action.type) {
        case ADD_NODE:
            const node = action.payload
            return { ...state, [node.address]: node }
        case REMOVE_NODE:
            const address = action.payload
            delete state[address]
            return { ...state }
        default: return state
    }
}
