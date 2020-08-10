import {
    BleStateUpdatedAction,
    ClearLogsAction,
    ConnectAction,
    DisconnectAction,
    ExecuteTestAction, ForgetSensorTagAction,
    LogAction, SensorTagFoundAction,
    TestFinishedAction, UpdateConnectionStateAction
} from "./actions";
import { BleError, Device, State } from "react-native-ble-plx";
import {ConnectionState} from "./reducer";

export function log(message: string): LogAction {
    console.log(message)
    return {
        type: 'LOG',
        message,
    };
}

export function logError(error: BleError) {
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

export function clearLogs(): ClearLogsAction {
    return {
        type: 'CLEAR_LOGS',
    };
}

export function connect(device: Device): ConnectAction {
    return {
        type: 'CONNECT',
        device,
    };
}

export function updateConnectionState(
    state: ConnectionState,
): UpdateConnectionStateAction {
    return {
        type: 'UPDATE_CONNECTION_STATE',
        state,
    };
}

export function disconnect(): DisconnectAction {
    return {
        type: 'DISCONNECT',
    };
}

export function bleStateUpdated(
    state: State,
): BleStateUpdatedAction {
    return {
        type: 'BLE_STATE_UPDATED',
        state,
    };
}

export function sensorTagFound(device: Device): SensorTagFoundAction {
    return {
        type: 'SENSOR_TAG_FOUND',
        device,
    };
}

export function forgetSensorTag(): ForgetSensorTagAction {
    return {
        type: 'FORGET_SENSOR_TAG',
    };
}

export function executeTest(id: string): ExecuteTestAction {
    return {
        type: 'EXECUTE_TEST',
        id,
    };
}

export function testFinished(): TestFinishedAction {
    return {
        type: 'TEST_FINISHED',
    };
}

