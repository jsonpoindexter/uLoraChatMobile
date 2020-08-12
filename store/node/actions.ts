import {ADD_NODE, LoraNode, NodeActionTypes} from "./types";

export const addNode = (node: LoraNode): NodeActionTypes => {
    return {
        type: ADD_NODE,
        payload: node
    }
}
