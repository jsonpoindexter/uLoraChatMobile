import {
    BleStateUpdatedAction,
    ClearLogsAction,
    ConnectAction,
    DisconnectAction,
    ExecuteTestAction, ForgetSensorTagAction,
    LogAction, SensorTagFoundAction,
    TestFinishedAction, UpdateConnectionStateAction
} from "./types";
import { BleError, Device, State } from "react-native-ble-plx";
import {ConnectionState} from "./reducer";

export const log = (message: string): LogAction  => {
    console.log(message)
    return {
        type: 'LOG',
        message,
    };
}

export const logError = (error: BleError)  => {
    return log(
        'ERROR: ' +
        error.message +
        ', ATT: ' +
        (error.attErrorCode || 'null') +
        ', iOS: ' +
        (error.iosErrorCode || 'null') +
        ', android: ' +
        (error.androidErrorCode || 'null') +
        ', reason: ' +
        (error.reason || 'null'),
    );
}

export const clearLogs = (): ClearLogsAction  => {
    return {
        type: 'CLEAR_LOGS',
    };
}

export const connect = (device: Device): ConnectAction  => {
    return {
        type: 'CONNECT',
        device,
    };
}

export const updateConnectionState = (state: ConnectionState): UpdateConnectionStateAction => {
    return {
        type: 'UPDATE_CONNECTION_STATE',
        state,
    };
}

export const disconnect = (): DisconnectAction  => {
    return {
        type: 'DISCONNECT',
    };
}

export const bleStateUpdated = (
    state: State,
): BleStateUpdatedAction => {
    return {
        type: 'BLE_STATE_UPDATED',
        state,
    };
}

export const sensorTagFound = (device: Device): SensorTagFoundAction  => {
    return {
        type: 'SENSOR_TAG_FOUND',
        device,
    };
}

export const forgetSensorTag = (): ForgetSensorTagAction  => {
    return {
        type: 'FORGET_SENSOR_TAG',
    };
}

// export const executeTest = (id: string): ExecuteTestAction  => {
//     return {
//         type: 'EXECUTE_TEST',
//         id,
//     };
// }
//
// export const testFinished = (): TestFinishedAction  => {
//     return {
//         type: 'TEST_FINISHED',
//     };
// }
//
