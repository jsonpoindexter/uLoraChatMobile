import React, {Component} from 'react'
import {Platform, StyleSheet, View, Text} from 'react-native'
import {Buffer} from 'buffer'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification"
import {useState} from 'react';
import {IconButton, TextInput} from "react-native-paper";
import {SectionList,} from "react-native";

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
    messageObjs: MessageObj[]
}


export enum MessageType {
    ACK = 'ACK'
}
export interface MessageObj {
    timestamp: number,
    message: string,
    sender: string
    type?: MessageType
    ack: boolean
}

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

interface ChatProps {
    messageObjs: MessageObj[]
    sendBleText: (text: string) => void
    name: string
}

export default function Index(props: ChatProps) {

    const chatItem = (messageObj: MessageObj) => {
        return <View style={{ display: 'flex', flexDirection: 'row'}}>
            <Text key={`${messageObj.timestamp}:${messageObj.message}:${messageObj.sender}` }
                  style={styles.chatItem}>[{formatTime(messageObj.timestamp)}] {"<"}{messageObj.sender}{">"} {messageObj.message}
            </Text>
            { messageObj.sender === props.name && messageObj.ack && <Text>[{"ACK"}]</Text> }

        </View>
    }

    const [text, setText] = useState('')

    const groupMessageObjs = () => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        const groups = props.messageObjs.reduce((groups: { [key: string]: MessageObj[] }, messageObj) => {
            const date = new Date(messageObj.timestamp)
            const dayName = dayNames[date.getDay()]
            const monthName = monthNames[date.getMonth()]
            const dateString = `${dayName}, ${monthName} ${date.getDate()}`
            if (!groups[dateString]) groups[dateString] = []
            groups[dateString].push(messageObj)
            return groups
        }, {})
        return Object.keys(groups).map((date) => {
            return {
                title: date,
                data: groups[date]
            };
        });
    }


    const sendText = () => {
        if (!props.name) {
            // props.showNameDialog() TODO: replace
            return
        }
        if (!text) return
        // props.sendBleText(text)
        setText('')
    }

    return (
        < View style={styles.chatContainer}>
            <SectionList
                sections={groupMessageObjs()}
                keyExtractor={(item) => item.timestamp.toString()}
                renderItem={({item}) => chatItem(item)}
                renderSectionHeader={({section: {title}}) => (
                    <View style={styles.chatItemHeaderWrapper}><Text
                        style={styles.chatItemHeaderText}>{title}</Text></View>
                )}
            />
            <View style={{display: "flex", flexDirection: "row"}}>
                <TextInput value={text} style={styles.chatInput} placeholder={`Send message as ${props.name}`}
                           onChangeText={text => setText(text)}/>
                <View style={{display: "flex", justifyContent: "center", backgroundColor: 'lightgrey'}}>
                    <IconButton icon="send" style={styles.chatSendButton} onPress={() => sendText()}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chatContainer: {
        height: '100%',
        display: 'flex',
        flexGrow: 1,
        color: "#ffffff",
        backgroundColor: "#ffffff",
    },
    chatItem: {
        fontFamily: "Menlo, Consolas, serif",
        color: "black",
        display: 'flex',
        flexGrow: 1,
    },
    chatItemHeaderWrapper: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'center'
    },
    chatItemHeaderText: {
        fontFamily: "Menlo, Consolas, serif",
        color: "black",
        fontSize: 18,
        paddingVertical: 5,
        paddingHorizontal: 20,
        marginVertical: 10
    },
    chatInput: {
        display: "flex",
        flexGrow: 1
    },
    chatSendButton: {
        borderWidth: 1,
        backgroundColor: 'lightgrey'
    }
});
