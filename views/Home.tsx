import React from 'react'
import {Component} from 'react'
import {StyleSheet, Text, TextComponent, View} from 'react-native'
import {BleError, BleManager, Device, State} from 'react-native-ble-plx'
import { Buffer } from 'buffer'
import {MessageObj} from "../components/chat";
// import {Notification, Notifications} from 'react-native-notifications';


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
                            let message = ''
                            if(characteristic && characteristic.value) {
                                console.log(characteristic.value.length)
                                const buff = Buffer.from(characteristic.value, 'base64');
                                message = buff.toString('utf-8')
                                this.setState({lastMsgReceived: message})
                                // const notification = new Notification({ body: " Local notification", title: "Title", silent: false, category: "SOME_CATEGORU"})
                                // Notifications.postLocalNotification(notification, 1);
                            }
                            console.log('listener recieve msg:', message)
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
