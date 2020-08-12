import {ADD_NODE, LoraNode, NodeActionTypes, REMOVE_NODE} from "./types";

export const addNode = (node: LoraNode): NodeActionTypes => {
    return {
        type: ADD_NODE,
        payload: node
    }
}

export const removeNode = (address: string) => {
    return {
        type: REMOVE_NODE,
        payload: address
    }
}
