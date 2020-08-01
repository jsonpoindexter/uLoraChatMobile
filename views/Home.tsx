import React from 'react'
import {Component} from 'react'
import {AppState, Platform, StyleSheet, View} from 'react-native'
import {BleError, BleManager, Characteristic, Device, State} from 'react-native-ble-plx'
import {Buffer} from 'buffer'
import Chat, {MessageObj} from "../components/Chat/index";

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification"
import {Banner} from "react-native-paper";

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

interface HomeProps {
    name: string,
    showNameDialog: () => void
}

interface HomeState {
    device?: Device
    manager: BleManager
    bluetoothStatus: string
    messageObjs: MessageObj[]
}

const DEVICE_NAME = 'ulora' // BLE Peripheral Name
const MAX_MTU_SIZE = 128

const stringToBase64 = (str: string): string => {
    const buff = Buffer.from(str, 'utf8');
    return buff.toString('base64');
}

const base64ToString = (base64str: string): string => {
    const buff = Buffer.from(base64str, 'base64');
    return buff.toString('utf8');
}

let i = 0
export default class Home extends Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props)
        this.state = {
            manager: new BleManager(),
            bluetoothStatus: 'init',
            messageObjs: [
            //     {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }, {"sender": "dino2", "timestamp": i++, "message": "hello"}, {
            //     "sender": "dino2",
            //     "timestamp": i++,
            //     "message": "hello"
            // }
            ]
        }
    }

    componentDidMount() {
        // When iOS application launches BLE stack is not immediately available and we need to check its status.
        // To detect current state and following state changes we can use onStateChange() function:
        const subscription = this.state.manager.onStateChange((state: State) => {
            console.log(`jphere: bluetooth state: ${state}`)
            this.setState({
                bluetoothStatus: state,
            })
            if (state === State.PoweredOn) {
                this.scan()
                subscription.remove()
            }
        }, true)
    }

    addMessage = (messageObj: MessageObj) => {
        this.setState({messageObjs: [messageObj, ...this.state.messageObjs].sort((a, b) => a.timestamp < b.timestamp ? -1 : 0)})
    }

    scan = () => {
        console.log("scanning...")
        this.setState({bluetoothStatus: 'scanning...'})
        this.state.manager.startDeviceScan(null, null, async (error: BleError | null, device: Device | null) => {
            if (error) {
                this.setState({bluetoothStatus: error.message})
                console.log(`jphere: startDeviceScan.error: `, error)
                return
            } else {
                if (device && device.name === DEVICE_NAME) {
                    try {
                        console.log(await device.isConnected())
                        await this.connect(device)
                        this.state.manager.stopDeviceScan()
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        })
    }
    onMessageRx = async (err: BleError | null, characteristic: Characteristic | null) => {
        if (err) console.log('jphere: monitorCharacteristicForService error:', err)
        else {
            let messageStr = ''
            if (characteristic && characteristic.value) {
                messageStr = base64ToString(characteristic.value)
                const messageObj: MessageObj = JSON.parse(messageStr)
                this.addMessage(messageObj)
                if (AppState.currentState !== 'active') {
                    console.log('appstate', AppState.currentState)
                    this.emitMessageNotification(messageObj)
                }
            }
            console.log('listener recieve msg:', messageStr)
            console.log(this.state.messageObjs)
        }
    }
    onMessageTx = async (message: string) => {
        if(!message || !this.props.name) {
            console.log("[onMessageTx] Cannot send message, missing message and/or sender")
        }
        const messageObj = {
            timestamp: new Date().getTime(),
            message,
            sender: this.props.name
        }
        try {
            await this.state.device?.writeCharacteristicWithResponseForService('6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
                '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', stringToBase64(JSON.stringify(messageObj))
            )
            this.addMessage(messageObj)
        }catch(err) {
            console.log(err)
        }

    }
    connect = async (device: Device) => {
        try {
            device.onDisconnected(() => {
                this.setState({
                    bluetoothStatus: 'disconnected'
                })
                this.scan()
            })
            await device.connect({requestMTU: MAX_MTU_SIZE})
            this.setState({device, bluetoothStatus: `connected`})
            console.log('jphere: connected!')
            await device.discoverAllServicesAndCharacteristics()
            device.monitorCharacteristicForService(
                '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
                '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
                this.onMessageRx,
            )
            // Request all current messages
            this.state.device?.writeCharacteristicWithResponseForService('6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
                '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', stringToBase64("ALL"))

        } catch (err) {
            console.log('jphere: error: ', err)
        }

    }
    emitMessageNotification(messageObj: MessageObj) {
        PushNotification.localNotification({
            /* Android Only Properties */
            id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            ticker: "My Notification Ticker", // (optional)
            showWhen: true, // (optional) default: true
            autoCancel: true, // (optional) default: true
            // largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            // largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
            // smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
            // subText: "This is a subText", // (optional) default: none
            // bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: "some_tag", // (optional) add tag to message
            group: "group", // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            priority: "high", // (optional) set notification priority, default: high
            visibility: "private", // (optional) set notification visibility, default: private
            importance: "high", // (optional) set notification importance, default: high
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
            shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
            channelId: "your-custom-channel-id", // (optjional) custom channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
            onlyAlertOnce: true, //(optional) alert will open only once with sound and notify, default: false

            // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
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
            // @ts-ignore
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Banner visible={this.state.bluetoothStatus !== 'connected'} actions={[]} style={styles.dropDownStatus}> Bluetooth Status: {this.state.bluetoothStatus}</Banner>
                <Chat messageObjs={this.state.messageObjs} sendBleText={(text) => this.onMessageTx(text)} showNameDialog={this.props.showNameDialog} name={this.props.name}  />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // alignItems: "center",
        // backgroundColor: '#2f3145',
        height: '100%',
        width: '100%'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 40,
        color: 'rgba(190,189,255,0.98)',
    },
    dropDownStatus: {
        width: '100%',
        position: "absolute",
        left: 0,
        top: 0,
        textAlign: 'center',
        // color: '#e4deff',
        // marginBottom: 5,
        // borderWidth: 2
        backgroundColor: 'lightgrey'
    },
})
