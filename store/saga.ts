import {AppState, PermissionsAndroid, Platform} from 'react-native';
import {buffers, eventChannel} from 'redux-saga';
import {
    fork,
    cancel,
    take,
    call,
    put,
    race,
    cancelled,
    actionChannel,
} from 'redux-saga/effects';
import {
    ConnectionState,
} from './ble/reducer';
import {
    BleManager,
    BleError,
    Device,
    State,
    LogLevel,
    Characteristic,
} from 'react-native-ble-plx';
import {bleStateUpdated, log, logError, sensorTagFound, updateConnectionState, connect} from "./ble/actions";
import {BleStateUpdatedAction, ConnectAction, UpdateConnectionStateAction} from "./ble/types";
import {MessageObj} from "./chat/types";
import {emitMessageNotification} from "../utils/notifications";
import {Buffer} from "buffer";
import {addMessage} from "./chat/actions";
import {EventChannel} from "@redux-saga/core";

const stringToBase64 = (str: string): string => {
    const buff = Buffer.from(str, 'utf8');
    return buff.toString('base64');
}

const base64ToString = (base64str: string): string => {
    const buff = Buffer.from(base64str, 'base64');
    return buff.toString('utf8');
}

export function* bleSaga(): Generator<any> {
    yield put(log('BLE saga started...'));

    // First step is to create BleManager which should be used as an entry point
    // to all BLE related functionalities
    const manager = new BleManager();
    manager.setLogLevel(LogLevel.Verbose);

    // All below generators are described below...
    yield fork(handleScanning, manager);
    yield fork(handleBleState, manager);
    yield fork(handleConnection, manager);
}

// This generator tracks our BLE state. Based on that we can enable scanning, get rid of devices etc.
// eventChannel allows us to wrap callback based API which can be then conveniently used in sagas.
function* handleBleState(manager: BleManager): Generator<any> {
    const stateChannel: any = yield eventChannel((emit) => {
        const subscription = manager.onStateChange((state) => {
            emit(state);
        }, true);
        return () => {
            subscription.remove();
        };
    }, buffers.expanding(1));

    try {
        while (true) {
            const newState = yield take<State>(stateChannel);
            // @ts-ignore
            yield put(bleStateUpdated(newState));
        }
    } finally {
        if (yield cancelled()) {
            stateChannel.close();
        }
    }
}

// This generator decides if we want to start or stop scanning depending on specific
// events:
// * BLE state is in PoweredOn state
// * Android's permissions for scanning are granted
// * We already scanned device which we wanted
function* handleScanning(manager: BleManager): Generator<any> {
    let scanTask = null;
    let bleState = State.Unknown;
    let connectionState = ConnectionState.DISCONNECTED;

    const channel = yield actionChannel([
        'BLE_STATE_UPDATED',
        'UPDATE_CONNECTION_STATE',
    ]);

    while (true) {
        // @ts-ignore
        const action: | BleStateUpdatedAction | UpdateConnectionStateAction = yield take(channel);

        switch (action.type) {
            case 'BLE_STATE_UPDATED':
                bleState = action.state;
                break;
            case 'UPDATE_CONNECTION_STATE':
                connectionState = action.state;
                break;
        }

        const enableScanning =
            bleState === State.PoweredOn &&
            (connectionState === ConnectionState.DISCONNECTING ||
                connectionState === ConnectionState.DISCONNECTED);

        if (enableScanning) {
            if (scanTask != null) {
                // @ts-ignore
                yield cancel(scanTask);
            }
            scanTask = yield fork(scan, manager);
        } else {
            if (scanTask != null) {
                // @ts-ignore
                yield cancel(scanTask);
                scanTask = null;
            }
        }
    }
}

// As long as this generator is working we have enabled scanning functionality.
// When we detect SensorTag device we make it as an active device.
function* scan(manager: BleManager): Generator<any> {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
        yield put(log('Scanning: Checking permissions...'));
        const enabled = yield call(
            PermissionsAndroid.check,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        );
        if (!enabled) {
            yield put(log('Scanning: Permissions disabled, showing...'));
            const granted = yield call(
                PermissionsAndroid.request,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                yield put(log('Scanning: Permissions not granted, aborting...'));
                // TODO: Show error message?
                return;
            }
        }
    }

    yield put(log('Scanning started...'));
    const scanningChannel = yield eventChannel((emit) => {
        manager.startDeviceScan(
            null,
            {allowDuplicates: true},
            (error, scannedDevice) => {
                if (error) {
                    emit([error, scannedDevice]);
                    return;
                }
                if (scannedDevice && scannedDevice.name === 'ulora') {
                    emit([error, scannedDevice]);
                }
            },
        );
        return () => {
            manager.stopDeviceScan();
        };
    }, buffers.expanding(1));

    try {
        while (true) {
            // @ts-ignore
            const [error, scannedDevice]: [BleError | null, Device | null] = yield take(scanningChannel);
            if (error != null) {
                console.log(error)
            }
            if (scannedDevice != null) {
                yield put(sensorTagFound(scannedDevice));
                yield put(connect(scannedDevice));
            }
        }
    } catch (error) {
        console.log(error)
    } finally {
        yield put(log('Scanning stopped...'));
        if (yield cancelled()) {
            // @ts-ignore
            scanningChannel.close();
        }
    }
}

function* handleBleRx(device: Device): Generator<any> {
    const characteristicChannel: any = yield eventChannel((emit) => {
        const subscription = device.monitorCharacteristicForService(
            '6E400001-B5A3-F393-E0A9-E50E24DCCA9E', // TODO make UUIDs global const
            '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
            (err: BleError | null, characteristic: Characteristic | null) => {
                if (err) console.log('jphere: monitorCharacteristicForService error:', err)
                else {
                    emit(characteristic)
                }
            }
        )
        return () => subscription.remove()

    }, buffers.expanding(1))
    try {
        while(true) {
            // @ts-ignore
            const characteristic: Characteristic = yield take<Characteristic>(characteristicChannel)
            let messageStr = ''
            if (characteristic && characteristic.value) {
                messageStr = base64ToString(characteristic.value)
                console.log('listener recieve msg:', messageStr)
                try {
                    const messageObj: MessageObj = JSON.parse(messageStr)
                    yield put(addMessage(messageObj))
                    if (AppState.currentState !== 'active') {
                        console.log('appstate', AppState.currentState)
                        emitMessageNotification(messageObj)
                    }
                } catch (err) {
                    console.log('unable to parse incoming json message')
                }
            }
        }
    } finally {
        if (yield cancelled()) {
            characteristicChannel.close();
        }
    }
}

function* handleConnection(manager: BleManager): Generator<any> {
    while (true) {
        // Take action
        // @ts-ignore
        const {device}: ConnectAction = yield take('CONNECT');

        const disconnectedChannel = yield eventChannel((emit) => {
            const subscription = device.onDisconnected((error: BleError | null, device: Device) => {
                emit({type: 'DISCONNECTED', error: error});
            });
            return () => {
                subscription.remove();
            };
        }, buffers.expanding(1));

        const deviceActionChannel = yield actionChannel([
            'DISCONNECT',
        ]);

        try {
            yield put(updateConnectionState(ConnectionState.CONNECTING));
            yield call([device, device.connect], {requestMTU: 128}); // TODO: make requestMTU a global const
            yield put(updateConnectionState(ConnectionState.DISCOVERING));
            yield call([device, device.discoverAllServicesAndCharacteristics]);
            yield put(updateConnectionState(ConnectionState.CONNECTED));
            yield fork(handleBleRx, device);
            // Request all current messages
            device.writeCharacteristicWithResponseForService('6E400001-B5A3-F393-E0A9-E50E24DCCA9E', '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', stringToBase64("ALL"))

            while (true) {
                // @ts-ignore
                const {deviceAction, disconnected} = yield race({deviceAction: take(deviceActionChannel), disconnected: take(disconnectedChannel),});

                if (deviceAction) {
                    if (deviceAction.type === 'DISCONNECT') {
                        yield put(log('Disconnected by user...'));
                        yield put(updateConnectionState(ConnectionState.DISCONNECTING));
                        yield call([device, device.cancelConnection]);
                        break;
                    }
                } else if (disconnected) {
                    yield put(log('Disconnected by device...'));
                    if (disconnected.error != null) {
                        yield put(logError(disconnected.error));
                    }
                    break;
                }
            }
        } catch (error) {
            yield put(logError(error));
        } finally {
            // @ts-ignore
            disconnectedChannel.close();
            // yield put(testFinished());
            yield put(updateConnectionState(ConnectionState.DISCONNECTED));
        }
    }
}
