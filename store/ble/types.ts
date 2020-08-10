import {ConnectionState} from "./reducer";
import {State, Device } from 'react-native-ble-plx';

export type Action =
    | LogAction
    | ClearLogsAction
    | ConnectAction
    | DisconnectAction
    | UpdateConnectionStateAction
    | BleStateUpdatedAction
    | SensorTagFoundAction
    | ForgetSensorTagAction
    // | ExecuteTestAction
    // | TestFinishedAction;

export type LogAction = {
    type: 'LOG',
    message: string,
};

export type ClearLogsAction = {
    type: 'CLEAR_LOGS',
};

export type ConnectAction = {
    type: 'CONNECT',
    device: Device,
};

export type DisconnectAction = {
    type: 'DISCONNECT',
};

export type UpdateConnectionStateAction = {
    type: 'UPDATE_CONNECTION_STATE',
    state: ConnectionState,
};

export type BleStateUpdatedAction = {
    type: 'BLE_STATE_UPDATED',
    state: State,
};

export type SensorTagFoundAction = {
    type: 'SENSOR_TAG_FOUND',
    device: Device,
};

export type ForgetSensorTagAction = {
    type: 'FORGET_SENSOR_TAG',
};

// export type ExecuteTestAction = {
//     type: 'EXECUTE_TEST',
//     id: string,
// };
//
// export type TestFinishedAction = {
//     type: 'TEST_FINISHED',
// };
