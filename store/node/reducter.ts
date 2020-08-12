import {ADD_NODE, NodeActionTypes, NodesState} from "./types";

export const initialState: NodesState = {}

export const nodes = (state = initialState, action: NodeActionTypes) => {
    switch(action.type) {
        case ADD_NODE:
            const node = action.payload
            return { ...state, [node.address]: node }
        default: return state
    }
}
