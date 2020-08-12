import {ADD_NODE, LoraNode, NodeActionTypes, NodesState} from "./types";

export const initialState: NodesState = {}

export const nodes = (state = initialState, action: NodeActionTypes) => {
    switch(action.type) {
        case ADD_NODE:
            const node = action.payload
            state[node.address] = node
            return state
        default: return state
    }
}
