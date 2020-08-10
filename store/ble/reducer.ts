
import {State, Device, BleError} from 'react-native-ble-plx';
import {Action} from "./actions";

export type ReduxState = {
    logs: Array<string>,
    activeError: BleError | null, // TODO: maybe can use ?/undefined
    activeSensorTag: Device | null,
    connectionState: ConnectionState,
    currentTest: string | null,
    bleState: State,
};

export enum ConnectionState {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTING = 'CONNECTING',
    DISCOVERING = 'DISCOVERING',
    CONNECTED = 'CONNECTED',
    DISCONNECTING = 'DISCONNECTING',
}

export const initialState: ReduxState = {
    bleState: State.Unknown,
    activeError: null,
    activeSensorTag: null,
    connectionState: ConnectionState.DISCONNECTED,
    currentTest: null,
    logs: [],
};


export const bleState = (
    state: ReduxState = initialState,
    action: Action,
) => {
    switch (action.type) {
        case 'LOG':
            return {...state, logs: [action.message, ...state.logs]};
        case 'CLEAR_LOGS':
            return {...state, logs: []};
        case 'UPDATE_CONNECTION_STATE':
            return {
                ...state,
                connectionState: action.state,
                logs: ['Connection state changed: ' + action.state, ...state.logs],
            };
        case 'BLE_STATE_UPDATED':
            return {
                ...state,
                bleState: action.state,
                logs: ['BLE state changed: ' + action.state, ...state.logs],
            };
        case 'SENSOR_TAG_FOUND':
            if (state.activeSensorTag) return state;
            return {
                ...state,
                activeSensorTag: action.device,
                logs: ['SensorTag found: ' + action.device.id, ...state.logs],
            };
        case 'FORGET_SENSOR_TAG':
            return {
                ...state,
                activeSensorTag: null,
            };
        case 'EXECUTE_TEST':
            if (state.connectionState !== ConnectionState.CONNECTED) {
                return state;
            }
            return {...state, currentTest: action.id};
        case 'TEST_FINISHED':
            return {...state, currentTest: null};
        default:
            return state;
    }
}
