import {AckMessageObj, NodeMessageType, SynMessageObj, UserMessageObj} from "../chat/types";

export const ADD_NODE = 'ADD_NODE'

export interface NodesState {
    [key: string]: LoraNode
}

export interface LoraNode {
    // name: string, TODO: implement local naming
    address: string,
    timestamp: number, // Time we received the SYN msg from BLE
    rssi: number,
}

interface addNodeAction {
    type:  typeof ADD_NODE,
    payload: LoraNode
}

export type NodeMessage = UserMessageObj | SynMessageObj | AckMessageObj

export type NodeActionTypes = addNodeAction
