import React from 'react'
import {Component} from 'react'
import {AppState, Platform, StyleSheet, Text, TextComponent, View} from 'react-native'
import {BleError, BleManager, Device, State} from 'react-native-ble-plx'
import { Buffer } from 'buffer'
import {MessageObj} from "../components/chat";
import { v4 as uuidv4 } from 'uuid';

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification"

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
    // // (optional) Called when Token is generated (iOS and Android)
    // onRegister: function (token) {
    //     console.log("TOKEN:", token);
    // },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    // onAction: function (notification) {
    //     console.log("ACTION:", notification.action);
    //     console.log("NOTIFICATION:", notification);
    //
    //     // process the action
    // },

    // // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    // onRegistrationError: function(err) {
    //     console.error(err.message, err);
    // },

    // // IOS ONLY (optional): default: all - Permissions to register.
    // permissions: {
    //     alert: true,
    //     badge: true,
    //     sound: true,
    // },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: Platform.OS === 'ios'
});

interface HomeState {
    devices: Device[]
    manager: BleManager
    bluetoothStatus: string
    lastBtReceived?: Date
    lastMsgReceived?: string
}

export default class Home extends Component<{}, HomeState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            devices: [],
            manager: new BleManager(),
            bluetoothStatus: 'init',
        }
        setInterval(() => {
            this.state.devices.forEach((device: Device) => {
                this.updateDeviceStatus(device)
            })
        }, 5000)
    }

    componentDidMount() {
        // When iOS application launches BLE stack is not immediately available and we need to check its status.
        // To detect current state and following state changes we can use onStateChange() function:
        const subscription = this.state.manager.onStateChange((state: State) => {
            console.log(`jphere: bluetooth state: ${state}`)
            this.setState({
                bluetoothStatus: state,
            })
            if (state === 'PoweredOn') {
                this.scan()
                this.setState({bluetoothStatus: 'scanning...'})
                subscription.remove()
            }
        }, true)
    }

    async updateDeviceStatus(device: Device) {
        const connected = await device.isConnected()
        console.log(`jphere: deviceStatus: ${connected}`)
        if(!connected) {
            this.scan()
            this.setState({bluetoothStatus: 'scanning...'})
        }

    }

    scan = () => {
        this.state.manager.startDeviceScan(null, null, (error: BleError | null, device: Device | null)  => {
            if (error) {
                this.setState({bluetoothStatus: error.message})
                console.log(`jphere: startDeviceScan.error: `, error)
                return
            } else {
                if (
                    device &&
                    device.name === 'ulora' &&
                    !this.state.devices.find((currentDevice: Device) => currentDevice.name === device.name)
                ) {
                    this.connect(device)
                    this.state.manager.stopDeviceScan()
                }
            }
        })
    }

    connect = (device: Device) => {
        device
            .connect({ requestMTU: 128 })
            .then(device => {
                console.log('jphere: connected!')
                const devices = this.state.devices.concat(device)
                this.setState({
                    devices,
                    bluetoothStatus: `connected to  ${devices.length} devices`,
                })
                return device.discoverAllServicesAndCharacteristics()
            })
            .then( device => {
                device.monitorCharacteristicForService(
                    '6E400001-B5A3-F393-E0A9-E50E24DCCA9e',
                    '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
                    (err, characteristic) => {
                        if (err) console.log('jphere: monitorCharacteristicForService error:', err)
                        else {
                            let messageStr = ''
                            if(characteristic && characteristic.value) {
                                console.log(characteristic.value.length)
                                const buff = Buffer.from(characteristic.value, 'base64');
                                messageStr = buff.toString('utf-8')
                                this.setState({lastMsgReceived: messageStr})
                                try {
                                    const messageObj: MessageObj = JSON.parse(messageStr)
                                    if(AppState.currentState !== 'active') {
                                        console.log('appstate', AppState.currentState)
                                        PushNotification.localNotification({
                                            /* Android Only Properties */
                                            // id: messageObj.timestamp.toString(), // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
                                            // ticker: "My Notification Ticker", // (optional)
                                            // showWhen: true, // (optional) default: true
                                            // autoCancel: true, // (optional) default: true
                                            // largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                                            // largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
                                            // smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                                            bigText: `[${messageObj.timestamp}] <${messageObj.sender}> ${messageObj.message}`, // (optional) default: "message" prop
                                            // subText: "This is a subText", // (optional) default: none
                                            // bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
                                            color: "red", // (optional) default: system default
                                            vibrate: true, // (optional) default: true
                                            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                                            // tag: "some_tag", // (optional) add tag to message
                                            group: "uLoraChat", // (optional) add group to message
                                            // @ts-ignore
                                            groupSummary: true, // (optional) set this notification to be the group summary for a group of notifications, default: false
                                            // ongoing: false, // (optional) set whether this is an "ongoing" notification
                                            priority: "high", // (optional) set notification priority, default: high
                                            visibility: "private", // (optional) set notification visibility, default: private
                                            importance: "high", // (optional) set notification importance, default: high
                                            // allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
                                            ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
                                            shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
                                            channelId: "your-custom-channel-id", // (optional) custom channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
                                            onlyAlertOnce: false, //(optional) alert will open only once with sound and notify, default: false

                                            actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
                                            invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

                                            /* iOS only properties */
                                            alertAction: "view", // (optional) default: view
                                            category: "", // (optional) default: empty string
                                            userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)

                                            /* iOS and Android properties */
                                            title: "New uLoraChat Message", // (optional)
                                            message: `[${messageObj.timestamp}] <${messageObj.sender}> ${messageObj.message}`, // (required)
                                            playSound: true, // (optional) default: true
                                            soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                                            // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
                                            // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
                                        });
                                    }

                                } catch(err) {
                                    console.log(err)
                                }


                            }
                            console.log('listener recieve msg:', messageStr)
                            this.setState({lastBtReceived: new Date()})
                        }
                    },
                )
            })
            .catch(err => console.log('jphere: error: ', err))
    }

    render() {
        let lastmessage = null
        if (this.state.devices.length > 0) {
            lastmessage = <Text>{ this.state.lastBtReceived?.toISOString() }</Text>
        } else {
            lastmessage = <Text>No devices yet</Text>
        }

        return (
            <View style={styles.container}>
                { lastmessage }
                <Text style={styles.instructions}>{this.state.lastMsgReceived}</Text>
                <Text style={styles.instructions}>Bluetooth Devices:</Text>
                <Text style={styles.instructions}>{this.state.bluetoothStatus}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // alignItems: "center",
        backgroundColor: '#2f3145',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 40,
        color: 'rgba(190,189,255,0.98)',
    },
    instructions: {
        textAlign: 'center',
        color: '#e4deff',
        marginBottom: 5,
    },
})
