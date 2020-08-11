import React from 'react'
import {Platform, StyleSheet, View, Text, SafeAreaView} from 'react-native'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification"
import {useState} from 'react';
import {IconButton, TextInput} from "react-native-paper";
import {SectionList,} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {MessageObj} from "../store/chat/types";

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

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

export default function Index() {
    const messageObjs = useSelector((state: RootState) => state.chatReducer.messageObjs)
    const name = useSelector((state: RootState) => state.chatReducer.name)
    const chatItem = (messageObj: MessageObj) => {
        return <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text key={`${messageObj.timestamp}:${messageObj.message}:${messageObj.sender}`}
                  style={styles.chatItem}>[{formatTime(messageObj.timestamp)}] {"<"}{messageObj.sender}{">"} {messageObj.message}
            </Text>
            {messageObj.sender === name && messageObj.ack && <Text>[{"ACK"}]</Text>}
        </View>
    }

    const [text, setText] = useState('')

    const groupMessageObjs = () => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        const groups = messageObjs.reduce((groups: { [key: string]: MessageObj[] }, messageObj) => {
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
        if (!name) {
            // props.showNameDialog() TODO: replace
            return
        }
        if (!text) return
        // props.sendBleText(text)
        setText('')
    }

    return (
        <SafeAreaView style={styles.chatContainer}>
            <View style={styles.chatItemsContainer}>
                <SectionList
                    sections={groupMessageObjs()}
                    keyExtractor={(item) => item.timestamp.toString()}
                    renderItem={({item}) => chatItem(item)}
                    renderSectionHeader={({section: {title}}) => (
                        <View style={styles.chatItemHeaderWrapper}><Text
                            style={styles.chatItemHeaderText}>{title}</Text></View>
                    )}
                />
            </View>

            <View style={styles.chatInputContainer}>
                <TextInput value={text} style={styles.chatInput} placeholder={`Send message as ${name}`}
                           onChangeText={text => setText(text)}/>
                <View style={styles.chatSendButtonContainer}>
                    <IconButton icon="send" style={styles.chatSendButton} onPress={() => sendText()}/>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    chatContainer: {
        display: 'flex',
        flexGrow: 1,
        // color: "#ffffff",
        // backgroundColor: "#ffffff",
    },
    chatItemsContainer: {
        display: 'flex',
        flexGrow: 1,
    },
    chatItem: {
        fontFamily: "Menlo, Consolas, serif",
        color: "black",
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
    chatInputContainer: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
    },
    chatInput: {
        display: "flex",
        flexGrow: 1
    },
    chatSendButtonContainer: {
        display: "flex",
        flexShrink: 0,
        justifyContent: "center",
        // backgroundColor: 'lightgrey'
    },
    chatSendButton: {
        borderWidth: 1,
        // backgroundColor: 'lightgrey'
    }
});
